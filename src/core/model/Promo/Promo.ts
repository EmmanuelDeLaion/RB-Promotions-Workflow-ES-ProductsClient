import { Entity } from "../../infrastructure";
import { CategoryType, Client, ClientProduct, WorkflowLog } from "../Common";
import { NewPromoState, PromoState, DraftPromoState } from "./PromoStates";
import { PromoStatus, PromoViewModel } from "./";
import { PromoItem } from "./PromoItem";
import { ApprovalState } from "./PromoStates/ApprovalState";
import { PromoWorkflowState } from "./PromoWorkflowState";
import { ApprovedState } from "./PromoStates/ApprovedState";
import { RejectedState } from "./PromoStates/RejectedState";
import { Configuration } from "../../infrastructure/Configuration";
import { PromoEvidence } from "./PromoEvidence";

export class Promo extends Entity {

    public PromoID: string;
    public Name: string = "";
    public ActivityObjective: string = "";
    public Client: Client;
    public Items: PromoItem[];
    public ItemsToDelete?: number[]; //Array de PromoItems a eliminar
    public CurrentStageNumber: number;
    public WorkflowStages: PromoWorkflowState[];
    public WorkflowLog: WorkflowLog[] = [];
    public Config: Configuration;
    public Evidence: PromoEvidence[] = [];
    protected _state: PromoState;
    public Approvals: string = "";

    constructor(configuration: Configuration) {
        super();

        this.Config = configuration;
        this.PromoID = this.Config.CountryCode + "--";
        this.Items = [new PromoItem({AdditionalID: this.PromoID + ".1", GetBaseGMSum: this.GetBaseGMSum.bind(this)})];

        this.ChangeState(PromoStatus.New);
    }

    public ChangeState(status: PromoStatus):void {
        switch (status) {
            case PromoStatus.New:
                this._state = new NewPromoState();
                break;
            case PromoStatus.Draft:
                this._state = new DraftPromoState();
                break;
            case PromoStatus.Approval:
                this._state = new ApprovalState();
                break;
            case PromoStatus.Approved:
                this._state = new ApprovedState();
                break;
            case PromoStatus.Rejected:
                this._state = new RejectedState();
                break;
            default:
                break;
        }

        this._state.Entity = this;
    }

    public InitializeState(): Promise<void> {
        return this._state.Initialize();
    }

    public GetStatusText():string {
        return this._state.GetStatusText();
    }

    public GetStatusId():number {
        return this._state.GetStatusId();
    }

    public GetPendingApproverIDs(): number[] {
        return this.GetStatusId() == PromoStatus.Approval ? this._state.GetCurrentStage().GetPendingUserIDs(): null;
    }

    public GetViewModel(): Promise<PromoViewModel> {
        return this._state.GetViewModel();
    }

    public Save(entity: Promo): Promise<void>
    {
        return this._state.Save(entity);
    }

    public Submit(entity: Promo): Promise<void>
    {
        return this._state.Submit(entity);
    }

    public Approve(comments: string): Promise<void>
    {
        return this._state.Approve(comments);
    }

    public Reject(comments: string): Promise<void>
    {
        return this._state.Reject(comments);
    }

    public GetBaseGMSum(category: CategoryType) {
        let value: number = 0;

        if(this.Items) {
            this.Items.map((item) => {
                if(item.GetCategoryType() == category)
                    value += item.GetBaseGM();
            });
        }

        return value;
    }

    public GetTotalEstimatedInvestment(): number {
        let value: number = 0;

        if(this.Items) {
            this.Items.map((item:PromoItem) => {
                value += item.GetEstimatedInvestment() || 0;
            });
        }

        return value;
    }

    public GetTotalEstimatedInvestmentAsString(): string {
        const value = this.GetTotalEstimatedInvestment();
        return value != null ? value.toLocaleString() : "0.00";
    }

    public GetROI(): number {
        //Queda excluída la inversión adicional MKT de los cálculos por estar ya incluída
        //en la inversión estimada (lo cual fue un cambio)
        let value: number = 0;
        let incrementalGM: number = 0;
        //let additionalInvestment: number = 0;
        const estimatedInvestment = this.GetTotalEstimatedInvestment();

        if(this.Items) {
            this.Items.map((item:PromoItem) => {
                incrementalGM += item.GetIncrementalGM() || 0;
                //additionalInvestment += item.AdditionalInvestment || 0;
            });


            const investment = estimatedInvestment;// + additionalInvestment;
            value = investment > 0 ? incrementalGM / investment : 0;
        }

        return value;
    }

    public GetROIAsString(): string {
        const value = this.GetROI();
        return value != null ? value.toFixed(2) : "0.00";
    }

    public IsEffective(): boolean {
        const roi = this.GetROI();
        return (roi != null && roi >=1);
    }

    public GetFromDate(): Date
    {
        return this.Items.reduce((prev, current) => {
            return (prev.StartDate < current.StartDate) ? prev : current;
        }).StartDate;
    }

    public GetToDate(): Date
    {
        return this.Items.reduce((prev, current) => {
            return (prev.EndDate > current.EndDate) ? prev : current;
        }).EndDate;
    }

    public EvidenceHasChanges(): boolean {
        let hasChanges = false;

        this.Evidence.forEach((evidence) => {
            if(evidence.File != null || evidence.Deleted){
                hasChanges = true;
                return;
            }
        });

        return hasChanges;
    }
}
