import * as React from 'react';
import { IPromoFormProps, IPromoFormState, PromoFormResult } from '.';
import { PromoService } from '../../services/PromoService';
import {
  PrimaryButton,
  DefaultButton,
  TextField,
  DialogContent,
  Shimmer,
  IShimmerStyleProps,
  IShimmerStyles,
  DialogFooter,
  Dropdown,
  IDropdownOption,
  Toggle,
  Label,
  Modal,
  IconButton,
  Dialog,
  Stack,
  Persona,
  PersonaSize,
  Link,
  Icon,
  mergeStyles,
  getTheme,
  IStackStyles,
  FontWeights,
  mergeStyleSets,
  Spinner,
  DialogType,
  IIconProps
} from 'office-ui-fabric-react';
import styles from './PromoForm.module.scss';
import { Category, Client, ClientProduct, Product, Type } from '../../model/Common';
import { ClientRepository } from '../../data';
import { PromoItem, PromoStatus } from '../../model/Promo';
import { Constants } from '../../Constants';
import { ActionConfirmationType, Entity, LookupValue } from '../../infrastructure';
import { ProductSelector } from '../ProductSelector/ProductSelector';
import { CommonHelper } from '../../common/CommonHelper';
import { ClientProductRepository } from '../../data/ClientProductRepository';
import { IPivotItemProps, Pivot, PivotItem } from '@fluentui/react-tabs';
require('../PromoForm/PromoForm.overrides.scss');
require('./PromoForm.css');
import { initializeTheme } from './Theme';
import { LastYearVolumesRepository } from '../../data/LastYearVolumesRepository';
import { LastYearVolumes } from '../../model/Common/LastYearVolumes';
import { RBDatePicker } from '../RBDatePicker/RBDatePicker';
import { PromoEvidence } from '../../model/Promo/PromoEvidence';
import { SecurityHelper } from '../../common/SecurityHelper';
import { containsInvalidFileFolderChars } from '@pnp/sp';
import { ClientsidePageFromFile } from '@pnp/sp/clientside-pages';
import { Item } from '@pnp/sp/items';
// import * as strings from 'PromoListViewLinkFieldCustomizerStrings';
import * as strings from 'PromoFormWebPartWebPartStrings';
import { _Item } from '@pnp/sp/items/types';

initializeTheme();
const theme = getTheme();

export class PromoForm extends React.Component<IPromoFormProps, IPromoFormState> {


  arrayPromoItemsDelete: any = [];


  constructor(props: IPromoFormProps) {
    super(props);
    this.state = {
      isLoading: true,
      hasValidationError: false,
      enableSubmit: false,
      formSubmitted: false,
      resultIsOK: false,
      selectedIndex: 0,
      loadingTypes: false,
      filteredProducts: [],
      mainModalOpen: true,
      hideDeleteProductDialog: true,
      hideDeleteEvidenceDialog: true,
      errorMessage: "",
      hideModalConfirmationDialog: true,
      promotionTitle: "",
      hideSavingSpinnerConfirmationDialog: true,
      hideActionConfirmationDialog: true,
      hideLoading: true,
      enableActionValidation: false,
      hideFileExistsMessageDialog: true,
      CopiarPromo: false,
      currentUser: "",
      canUploadEvidence: false
    };
  }

  async GetUser() {
    const user = await SecurityHelper.GetCurrentUser();
    if (user) {
      this.setState({
        currentUser: user.Value
      })
    }
    else {
      this.setState({
        currentUser: ""
      })
    }
  }

  public componentDidMount() {
    this.GetUser();

    PromoService.GetViewModel(this.props.itemId).then((viewModel) => {

      this.setState({
        isLoading: false,
        enableSubmit: true,
        viewModel: viewModel
      });

      this.setState((state, props) => ({
        CopiarPromo: viewModel.Entity.Client && this.state.currentUser ? (viewModel.Entity.Client.KeyAccountManager.Value == this.state.currentUser ? true : false) : false,//(viewModel.Entity.GetStatusText() == "Borrador" ? true : false)
        canUploadEvidence:
          (
            this.state.viewModel.Entity.GetStatusId() == PromoStatus.Draft ||
            this.state.viewModel.Entity.GetStatusId() == PromoStatus.Rejected ||
            this.state.viewModel.Entity.GetStatusId() == PromoStatus.New
          )
            && (this.state.viewModel ? this.state.viewModel.ReadOnlyForm : true) == false
            ?
            true :
            (this.state.viewModel.Entity.GetStatusId() == PromoStatus.Approved ? true : false)
      }));


      // TODO: Filtra todos los prouctos de cada cliente
      let newState = this.state as IPromoFormState;
      if (this.state.viewModel.Entity.Client) {
        ClientProductRepository.GetAll(this.state.viewModel.Entity.Client.Name).then((products) => {
          newState.viewModel.ClientProducts = products;
          this.setState({
            hideLoading: true
          });
        });
        return newState;
      }




    }).catch((err) => {
      console.error(err);
      this.setState({ formSubmitted: true, isLoading: false, errorMessage: err });
    });
  }

  public render(): React.ReactElement<IPromoFormProps> {

    const entity = this.state.viewModel ? this.state.viewModel.Entity : null;
    const client = entity ? entity.Client : null;
    const channel = client ? client.Channel : null;
    const headOfChannel = channel ? channel.HeadOfChannel : null;
    const kam = client ? client.KeyAccountManager : null;
    const subchannel = client ? client.Subchannel : null;
    const selectedItem = entity ? entity.Items[this.state.selectedIndex] : null;
    const readOnlyForm = this.state.viewModel ? this.state.viewModel.ReadOnlyForm : true;


    let output =
      <DialogContent
        title={this.props.title}
        subText={strings.LoadingForm}
        onDismiss={this.props.close}
        showCloseButton={true}>
        <div className={styles.promoForm}>
          <Shimmer
            width="100%"
            styles={this._getShimmerStyles}
          />
        </div>
      </DialogContent>;

    if (!this.state.isLoading && !this.state.formSubmitted) {
      //#region Collections


      const clients: Array<{ key: number, text: string }> =
        this.state.viewModel.Clients != null ?
          (this.state.viewModel.Clients as Array<Client>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Name };
          }) : [];

      /*const clients: Array<{ key: number, text: string}> =
          this.GetFilteredCLients() != null ?
          (this.state.viewModel.Clients as Array<Client>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Name };
          }) : [];*/

      const categories: Array<{ key: number, text: string }> =
        this.state.viewModel.Categories != null ?
          (this.state.viewModel.Categories as Array<Category>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Name };
          }) : [];

      const types: Array<{ key: number, text: string }> =
        this.state.viewModel.Types != null ?
          (this.state.viewModel.Types as Array<Type>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Name };
          }) : [];

      const businessUnits: Array<{ key: number, text: string }> =
        this.GetFilteredBUs() != null ?
          (this.GetFilteredBUs() as Array<LookupValue>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Value };
          }) : [];

      const brands: Array<{ key: number, text: string }> =
        this.GetFilteredBrands() != null ?
          (this.GetFilteredBrands() as Array<LookupValue>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Value };
          }) : [];

      const productCategories: Array<{ key: number, text: string }> =
        this.GetFilteredProductCategories() != null ?
          (this.GetFilteredProductCategories() as Array<LookupValue>).map((item): { key: number, text: string } => {
            return { key: item.ItemId, text: item.Value };
          }) : [];

      //#endregion

      output =
        <div>
          <Modal isOpen={this.state.mainModalOpen} className="mainModal">
            <Shimmer
              width="100%"
              styles={this._getShimmerStyles}
              customElementsGroup={this.getCustomShimmerElementsGroup()}
              isDataLoaded={!this.state.isLoading}
              onClick={() => this.setState({ isLoading: false })}>

              {/* Modal Header*/}

              <div className={this.contentStyles.header}>
                <span>{this.state.viewModel.GetPromotionTitle()}</span>
                <IconButton
                  styles={this.iconButtonStyles}
                  iconProps={this.cancelIcon}
                  ariaLabel="Close popup modal"
                  onClick={this.onCloseModal.bind(this)}
                  autoFocus={false}
                />
              </div>
              <Dialog
                hidden={this.state.hideModalConfirmationDialog}
                dialogContentProps={this.closeModalDialogContentProps}
                styles={this.confirmationDialogStyles}
                onDismiss={() => this.setState({ hideModalConfirmationDialog: true })}>
                <DialogFooter>
                  <DefaultButton
                    onClick={() => this.setState({ hideModalConfirmationDialog: true })}
                    text={strings.Cancel} />
                  <PrimaryButton
                    onClick={this.props.close}
                    text={strings.ExitWithoutSave}
                    style={{
                      backgroundColor: "#425C68",
                      border: "transparent"
                    }} />
                </DialogFooter>
              </Dialog>

              {/* Fin Modal Header*/}

              {/* Modal Content*/}

              <Stack className="mainPadding">
                <Pivot aria-label="Main Pivot" className="mainPivot" overflowBehavior="menu">
                  <PivotItem onRenderItemLink={this._customPromotionPivotItemRenderer.bind(this, entity.PromoID)}>
                    <Stack styles={this.repetitiveSectionStyle}>
                      <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                        <PrimaryButton
                          text={strings.CopyPromotion}
                          style={{
                            display: this.state.CopiarPromo ? "block" : "none",
                            backgroundColor: "#425C68",
                            border: "transparent"
                          }}
                          allowDisabledFocus
                          onClick={
                            this.copyPromo.bind(this)
                          }
                        />
                        <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                        <Stack className="label">{strings.Status}:</Stack>
                        <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>{entity.GetStatusText()}</Stack>
                      </Stack>
                      {/* Promotion section */}
                      <Stack horizontal className="padding">
                        <Stack grow={8} verticalAlign="start" className="fixedStructure">
                          <Stack grow={12} horizontal className="smallPadding">
                            <Stack grow={6} className="padding-right controlPadding fixedStructure">
                              <TextField
                                label={strings.PromotionTitle + ":"}
                                value={entity.Name}
                                placeholder={strings.EnterTheTitleOfThePromotion}
                                required={!readOnlyForm}
                                errorMessage={this.getValidationErrorMessage(entity.Name)}
                                autoFocus={true}
                                onChange={this.onNameChange.bind(this)}
                                autoComplete="Off"
                                readOnly={readOnlyForm}
                                maxLength={100}
                              />
                            </Stack>
                            <Stack grow={6} className="padding-right controlPadding fixedStructure">
                              {!readOnlyForm ?
                                <Dropdown
                                  placeholder={strings.SelectACustomer}
                                  label={strings.Customer + ":"}
                                  options={clients}
                                  selectedKey={entity.Client ? entity.Client.ItemId : null}
                                  onChanged={this.onClientChanged.bind(this)}
                                  required={true}
                                  errorMessage={this.getValidationErrorMessage(entity.Client)}
                                /> :
                                <TextField
                                  label={strings.Customer}
                                  value={entity.Client ? entity.Client.Name : ""}
                                  readOnly={true}
                                />
                              }
                            </Stack>
                          </Stack >
                          <Stack grow={12} className="padding-right multilineControlPadding">
                            <TextField
                              label={strings.ActivityObjective + ":"}
                              required={!readOnlyForm}
                              multiline={true}
                              rows={3}
                              onChange={this.onActivityObjectiveChange.bind(this)}
                              value={entity.ActivityObjective}
                              autoComplete="Off"
                              errorMessage={this.getValidationErrorMessage(entity.ActivityObjective)}
                              readOnly={readOnlyForm}
                              maxLength={500}
                            />
                          </Stack>
                        </Stack>
                        <Stack grow={4} horizontal className="fixedStructure">
                          <Stack grow={12} className="grayBorderLeft">
                            <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                              <Label className="peopleLabel"> {strings.HeadOfChannel} </Label>
                              <div style={{ display: headOfChannel ? "block" : "none" }}>
                                <Persona
                                  //TODO: Cargar imagen y account name
                                  //{...this.examplePersona}
                                  text={headOfChannel ? headOfChannel.Value : null}
                                  size={PersonaSize.size24}
                                  //presence={PersonaPresence.online}
                                  hidePersonaDetails={false}
                                  imageAlt={headOfChannel ? headOfChannel.Value : null}
                                />
                              </div>
                            </Stack>
                            <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                              <Label className="peopleLabel"> {strings.ManagerKAMLP} </Label>
                              <div style={{ display: kam ? "block" : "none" }}>
                                <Persona
                                  //TODO: Cargar imagen y account name
                                  text={kam ? kam.Value : null}
                                  size={PersonaSize.size24}
                                  //presence={PersonaPresence.online}
                                  hidePersonaDetails={false}
                                  imageAlt={kam ? kam.Value : null}
                                />
                              </div>
                            </Stack>
                            <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                              <Label className="peopleLabel"> {strings.ChannelLP} </Label>
                              <Label className="labelNotBold">{channel ? channel.Name : null}</Label>
                            </Stack>
                            <Stack horizontal className="smallPadding padding-left peopleHeaderStyles noMarginBottom" verticalFill verticalAlign="center">
                              <Label className="peopleLabel"> {strings.Subchannel} </Label>
                              <Label className="labelNotBold">{subchannel ? subchannel.Value : null}</Label>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>

                      {/* Repetitive section */}
                      <Stack>
                        <Pivot
                          className="innerPivot"
                          aria-label="Inner Pivot"
                          overflowBehavior="menu"
                          onLinkClick={this.onTabLinkClicked.bind(this)}
                          selectedKey={this.state.selectedIndex.toString()}>
                          {entity.Items.map((item, index) => {
                            const isInvalid = this.state.hasValidationError && !item.IsValid();
                            return (
                              <PivotItem
                                headerText={item.AdditionalID}
                                headerButtonProps={{
                                  'data-order': index + 1, 'data-title': item.AdditionalID, style: isInvalid ? {
                                    color: "#a4262c",
                                    border: "1px dashed #a4262c",
                                    borderBottomWidth: "0"
                                  } : { border: "1px solid transparent" }
                                }}
                                itemKey={index.toString()}>
                              </PivotItem>
                            );
                          })}
                          {!readOnlyForm &&
                            <PivotItem headerText={strings.New} itemIcon="Add" onClick={this.AddPromoItem.bind(this)} itemKey="ADD" />
                          }
                        </Pivot>
                        <Stack className="deleteProductContainer" horizontal horizontalAlign="end">
                          <Stack className="label">
                            <div style={{ display: entity.Items.length > 1 ? "block" : "none" }}>
                              <Link onClick={() => this.setState({ hideDeleteProductDialog: false })}><Icon iconName="MapLayers" /><span style={{ color: '#323130' }}> {strings.DeleteProduct} </span></Link>
                            </div>
                          </Stack>
                          <Dialog
                            hidden={this.state.hideDeleteProductDialog}
                            dialogContentProps={this.deleteProductDialogContentProps}
                            styles={this.confirmationDialogStyles}
                            onDismiss={() => this.setState({ hideDeleteProductDialog: true })}>
                            <DialogFooter>
                              <PrimaryButton onClick={this.RemovePromoItem.bind(this)} text={strings.Remove}
                                style={{
                                  backgroundColor: "#425C68",
                                  border: "transparent"
                                }} />
                              <DefaultButton onClick={() => this.setState({ hideDeleteProductDialog: true })} text={strings.Cancel} />
                            </DialogFooter>
                          </Dialog>
                        </Stack>
                        <Stack horizontal styles={this.repetitiveSectionStyle} className="padding">
                          <Stack grow={8} className="fixedStructure">
                            <Stack styles={{ root: { maxHeight: "30px" } }} className="smallPadding padding-right" grow={6}>
                              <Stack horizontal className="actividadTopadaContainer smallPadding-left">
                                <Stack>
                                  <Label> {strings.LimitedActivity} </Label>
                                </Stack>
                                <Stack className="toRight smallPadding actividadTopadaToggle">
                                  <Toggle
                                    onText={strings.Yes} // Si
                                    offText={strings.No} // No
                                    onChange={this.onCappedActivityChanged.bind(this)}
                                    checked={selectedItem.CappedActivity}
                                    disabled={readOnlyForm || entity.Client == null} //Test
                                  />
                                </Stack>
                              </Stack>
                            </Stack>
                            <Stack horizontal grow={12} styles={{ root: { paddingTop: "16px" } }}>
                              <Stack className="smallPadding fixedStructure" grow={6}>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <Dropdown
                                      placeholder={strings.SelectABU}
                                      label={strings.BU + ":"}
                                      options={businessUnits}
                                      disabled={entity.Client == null} //Test
                                      selectedKey={selectedItem.BusinessUnit ? selectedItem.BusinessUnit.ItemId : null}
                                      onChanged={this.onBusinessUnitChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.BusinessUnit)}
                                    /> :
                                    <TextField
                                      label={strings.BU}
                                      value={selectedItem.BusinessUnit ? selectedItem.BusinessUnit.Value : ""}
                                      readOnly={true}
                                    />
                                  }
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <Dropdown
                                      placeholder={strings.SelectACategory}
                                      label={strings.PromotionCategoryLD + ":"}
                                      options={categories}
                                      disabled={entity.Client == null} //Test
                                      selectedKey={selectedItem.Category ? selectedItem.Category.ItemId : null}
                                      onChanged={this.onCategoryChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Category)}
                                    /> :
                                    <TextField
                                      label={strings.PromotionCategoryLD + ":"}
                                      value={selectedItem.Category ? selectedItem.Category.Name : ""}
                                      readOnly={true}
                                    />
                                  }
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    label={strings.ShortDescription + ":"}
                                    onChange={this.onShortDescriptionChange.bind(this)}
                                    value={selectedItem ? selectedItem.ShortDescription : ""}
                                    required={!readOnlyForm}
                                    disabled={entity.Client == null} //Test
                                    autoComplete="Off"
                                    errorMessage={this.getValidationErrorMessage(selectedItem.ShortDescription)}
                                    readOnly={readOnlyForm}
                                    maxLength={100}
                                  />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <ProductSelector
                                      clientProducts={this.GetFilteredProducts()}
                                      onChanged={this.onProductChanged.bind(this)}
                                      value={selectedItem.ClientProduct}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Client)}
                                      required={readOnlyForm}
                                      isDisabled={entity.Client == null}
                                    /> :
                                    <TextField
                                      label={strings.SKU}
                                      value={selectedItem.ClientProduct ? selectedItem.ClientProduct.SKUNumber + " - " + selectedItem.ClientProduct.SKUDescription : ""}
                                      readOnly={true}
                                      disabled={entity.Client == null} //Test
                                    />
                                  }

                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <RBDatePicker
                                      label={strings.StartDate + ":"}
                                      onSelectDate={this.onSelectStartDate.bind(this)}
                                      required={!readOnlyForm}
                                      value={selectedItem.StartDate!}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.StartDate)}
                                      maxDate={selectedItem.EndDate}
                                      isDisabled={entity.Client == null} //Test
                                    /> :
                                    <TextField
                                      label={strings.StartDate + ":"}
                                      value={CommonHelper.formatDate(selectedItem.StartDate)}
                                      readOnly={true}
                                      disabled={entity.Client == null} //Test
                                    />
                                  }
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    label={strings.DiscountPerEach + ":"}
                                    onChange={this.onDiscountPerPieceChange.bind(this)}
                                    value={selectedItem.GetDiscountPerPieceAsString()}
                                    required={selectedItem.RequiresDiscountPerPiece() && !readOnlyForm}
                                    autoComplete="Off"
                                    disabled={!selectedItem.RequiresDiscountPerPiece()}
                                    errorMessage={selectedItem.RequiresDiscountPerPiece() ? this.getValidationErrorMessage(selectedItem.GetDiscountPerPieceAsString()) : CommonHelper.EmptyString}
                                    readOnly={readOnlyForm}
                                    type="number"
                                    step={0.01}
                                  />
                                </Stack>
                              </Stack>
                              <Stack className="smallPadding fixedStructure" grow={6}>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <Dropdown
                                      placeholder={strings.SelectACategory + ":"}
                                      label={strings.Category + ":"}
                                      options={productCategories}
                                      disabled={entity.Client == null} //Test
                                      selectedKey={selectedItem.ProductCategory ? selectedItem.ProductCategory.ItemId : null}
                                      onChanged={this.onProductCategoryChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.ProductCategory)}
                                    /> :
                                    <TextField
                                      label={strings.Category + ":"}
                                      value={selectedItem.ProductCategory ? selectedItem.ProductCategory.Value : ""}
                                      readOnly={true}
                                      disabled={entity.Client == null} //Test
                                    />
                                  }

                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <Dropdown
                                      placeholder={strings.SelectAType}
                                      label={strings.TypeOfPromotionLD + ":"}
                                      options={types}
                                      disabled={this.state.loadingTypes || types.length === 0}
                                      selectedKey={selectedItem.Type ? selectedItem.Type.ItemId : null}
                                      onChanged={this.onTypeChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Type)}
                                    /> :
                                    <TextField
                                      label={strings.TypeOfPromotionLD + ":"}
                                      value={selectedItem.Type ? selectedItem.Type.Name : ""}
                                      readOnly={true}
                                      disabled={entity.Client == null} //Test
                                    />
                                  }
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    label={strings.Investment + ":"}
                                    onChange={this.onInvestmentChange.bind(this)}
                                    value={selectedItem ? selectedItem.GetInvestmentAsString() : ""}
                                    required={selectedItem.RequiresInvestment() && !readOnlyForm}
                                    autoComplete="Off"
                                    disabled={!selectedItem.RequiresInvestment()}
                                    errorMessage={selectedItem.RequiresInvestment() ? this.getValidationErrorMessage(selectedItem.GetInvestmentAsString()) : CommonHelper.EmptyString}
                                    readOnly={readOnlyForm}
                                    type="number"
                                    step={0.01}
                                  />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <Dropdown
                                      placeholder={strings.SelectABrand}
                                      label={strings.Brand + ":"}
                                      options={brands}
                                      disabled={entity.Client == null} //Test
                                      selectedKey={selectedItem.Brand ? selectedItem.Brand.ItemId : null}
                                      onChanged={this.onBrandChanged.bind(this)}
                                      required={true}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.Brand)}
                                    /> :
                                    <TextField
                                      label={strings.Brand + ":"}
                                      value={selectedItem.Brand ? selectedItem.Brand.Value : ""}
                                      readOnly={true}
                                      disabled={entity.Client == null} //Test
                                    />
                                  }
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  {!readOnlyForm ?
                                    <RBDatePicker
                                      label={strings.EndDate + ":"}
                                      onSelectDate={this.onSelectEndDate.bind(this)}
                                      required={!readOnlyForm}
                                      value={selectedItem.EndDate!}
                                      errorMessage={this.getValidationErrorMessage(selectedItem.EndDate)}
                                      minDate={selectedItem.StartDate}
                                      isDisabled={entity.Client == null} //Test
                                    /> :
                                    <TextField
                                      label={strings.EndDate + ":"}
                                      value={CommonHelper.formatDate(selectedItem.EndDate)}
                                      readOnly={true}
                                      disabled={entity.Client == null} //Test
                                    />
                                  }
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    label={strings.Redemption + ":"}
                                    onChange={this.onRedemptionChange.bind(this)}
                                    value={selectedItem.GetRedemptionAsString()}
                                    required={selectedItem.RequiresRedemption() && !readOnlyForm}
                                    autoComplete="Off"
                                    disabled={!selectedItem.RequiresRedemption()}
                                    errorMessage={selectedItem.RequiresRedemption() ? this.getValidationErrorMessage(selectedItem.GetRedemptionAsString()) : CommonHelper.EmptyString}
                                    readOnly={readOnlyForm}
                                    type="number"
                                    step={0.01}
                                  />
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack grow={4} className="fixedStructure">
                            <Stack className="smallPadding" grow={4} horizontal>
                              <Stack grow={12} className="grayBorderLeft">
                                <Stack horizontal className="grayHeader padding padding-left padding-right">
                                  <Icon iconName="DietPlanNotebook" />
                                  <Label> {strings.PromotionsDetails} </Label>
                                </Stack>
                                <Stack className="grayContent smallPadding padding-left padding-right" verticalFill>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.NetPriceOFF} </Label>
                                    <Label className="toRight">{selectedItem.RequiresNetPrice() ? (entity.Config.CurrencySymbol + " " + selectedItem.GetNetPriceAsString()) : "N/A"}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.Discount} </Label>
                                    <Label className="toRight">{selectedItem.RequiresDiscountPerPiece() ? (selectedItem.GetDiscountPercentageAsString() + "%") : "N/A"}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.BEPNR} </Label>
                                    <Label className="toRight">{selectedItem.GetBEPNRAsString() + "%"}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.GMNR} </Label>
                                    <Label className="toRight">{selectedItem.GetGMPercentageNRAsString() + "%"}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.GMNRWithPromo} </Label>
                                    <Label className="toRight">{selectedItem.RequiresDiscountPerPiece() ? selectedItem.GetGMPercentageNRWithPromoAsString() + "%" : "N/A"}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.GMBaseUnit} </Label>
                                    <Label className="toRight">{entity.Config.CurrencySymbol + " " + selectedItem.GetGMBaseUnitAsString()}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.GMPromoUnit} </Label>
                                    <Label className="toRight">{entity.Config.CurrencySymbol + " " + selectedItem.GetGMPromoUnitAsString()}</Label>
                                  </Stack>
                                  <Stack verticalFill horizontal className="verticalPadding detailsControlPadding borderBottom" verticalAlign="center">
                                    <Label> {strings.BEPGM} </Label>
                                    <Label className="toRight">{selectedItem.RequiresDiscountPerPiece() ? (selectedItem.GetBEPGMAsString() + "%") : "N/A"}</Label>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                        <Stack className="padding-bottom">
                          <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                            <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding fixedStructure">
                              <Icon iconName="DietPlanNotebook" />
                              <Label> {strings.PreAnalysis} </Label>
                            </Stack>
                            <Stack grow={3} horizontalAlign="end" className="fixedStructure">
                              <Label> {strings.EstimatedInvestment} </Label>
                              <Label>{entity.Config.CurrencySymbol + " " + selectedItem.GetEstimatedInvestmentAsString()}</Label>
                            </Stack>
                            <Stack grow={3} horizontalAlign="end" className="fixedStructure">
                              <Label> {strings.ROIEstimatedBySku} </Label>
                              <Label>{selectedItem.GetROIAsString()}</Label>
                            </Stack>
                            <Stack grow={3} horizontalAlign="end" className="fixedStructure">
                              <Label> {strings.Effectiveness} </Label>
                              <div hidden={!selectedItem.IsEffective()} className="effectiveLabelContainer">
                                <span className="effectiveLabel"> {strings.Effective} </span>
                              </div>
                              <div hidden={selectedItem.IsEffective()} className="effectiveLabelContainer">
                                <span className="effectiveLabel notEffectiveLabel"> {strings.NotEffective} </span>
                              </div>
                            </Stack>
                          </Stack>
                          <Stack className="grayContent padding padding-left padding-right">
                            <Stack horizontal>
                              <Stack className="smallPadding padding-right controlPadding fixedStructure" grow={4}>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <TextField
                                    label={strings.BaseVolume}
                                    onChange={this.onBaseVolumeChange.bind(this)}
                                    value={selectedItem.GetBaseVolumeAsString()}
                                    required={!readOnlyForm}
                                    autoComplete="Off"
                                    errorMessage={this.getValidationErrorMessage(selectedItem.GetBaseVolumeAsString())}
                                    readOnly={readOnlyForm}
                                    width="100%"
                                    disabled={entity.Client == null} //Test
                                  />
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.VolumeLY} </Label>
                                  <Label className="toRight">{selectedItem.GetLastYearVolumeAsString()}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.NRBase} </Label>
                                  <Label className="toRight">{selectedItem.RequiresBaseNR() ? (entity.Config.CurrencySymbol + " " + selectedItem.GetBaseNRAsString()) : "N/A"}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.GMBase} </Label>
                                  <Label className="toRight">{selectedItem.RequiresBaseGM() ? (entity.Config.CurrencySymbol + " " + selectedItem.GetBaseGMAsString()) : "N/A"}</Label>
                                </Stack>
                                <Stack className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <TextField
                                    label={strings.AdditionalInvestmentMKT}
                                    onChange={this.onAdditionalInvestmentChange.bind(this)}
                                    value={selectedItem.GetAdditionalInvestmentAsString()}
                                    autoComplete="Off"
                                    readOnly={readOnlyForm}
                                    width="100%"
                                    type="number"
                                    step={0.01}
                                    disabled={entity.Client == null} //Test
                                  />
                                </Stack>
                              </Stack>
                              <Stack className="smallPadding padding-right controlPadding fixedStructure" grow={4}>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <TextField
                                    label={strings.EstimatedIncrementalVolume}
                                    onChange={this.onEstimatedIncrementalVolumeChange.bind(this)}
                                    value={selectedItem.GetEstimatedIncrementalVolumeAsString()}
                                    required={!readOnlyForm}
                                    autoComplete="Off"
                                    errorMessage={this.getValidationErrorMessage(selectedItem.GetEstimatedIncrementalVolumeAsString())}
                                    readOnly={readOnlyForm}
                                    width="100%"
                                    disabled={entity.Client == null} //Test
                                  />
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.VolumeAverageL3Months} </Label>
                                  <Label className="toRight">{selectedItem.GetAverageVolumeL3MonthsAsString()}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.EstimatedIncrementalNR} </Label>
                                  <Label className="toRight">{selectedItem.RequiresIncrementalEstimatedNR() ? (entity.Config.CurrencySymbol + " " + selectedItem.GetIncrementalEstimatedNRAsString()) : "N/A"}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.GMEstimatedPromo} </Label>
                                  <Label className="toRight">{selectedItem.RequiresEstimatedGMPromo() ? (entity.Config.CurrencySymbol + " " + selectedItem.GetEstimatedGMPromoAsString()) : "N/A"}</Label>
                                </Stack>
                              </Stack>
                              <Stack className="smallPadding padding-right controlPadding fixedStructure" grow={4}>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.TotalEstimatedVolume} </Label>
                                  <Label className="toRight">{selectedItem.RequiresTotalEstimatedVolume() ? selectedItem.GetTotalEstimatedVolumeAsString() : "N/A"}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.IncrementalVolume} </Label>
                                  <Label className="toRight">{selectedItem.RequiresIncrementalVolumePercentage() ? (selectedItem.GetIncrementalVolumePercentageAsString() + "%") : "N/A"}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.EstimatedNR} </Label>
                                  <Label className="toRight">{selectedItem.RequiresEstimatedNR() ? entity.Config.CurrencySymbol + " " + selectedItem.GetEstimatedNRAsString() : "N/A"}</Label>
                                </Stack>
                                <Stack horizontal className="verticalPadding controlPadding borderBottom alignMiddle">
                                  <Label> {strings.IncrementalGM} </Label>
                                  <Label className="toRight">{selectedItem.RequiresIncrementalGM() ? (entity.Config.CurrencySymbol + " " + selectedItem.GetIncrementalGMAsString()) : "N/A"}</Label>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                      <div hidden={entity.WorkflowLog == null || entity.WorkflowLog.length == 0}>
                        <Stack className="padding-bottom">
                          <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                            <Stack horizontal className="verticalPadding preAnalisisPadding fixedStructure">
                              <Icon iconName="TaskLogo" />
                              <Label> {strings.Approvals} </Label>
                            </Stack>
                          </Stack>
                          <Stack className="grayContent padding padding-left padding-right">
                            {entity.WorkflowLog.map((log) => {
                              return (
                                <Stack grow={12}>
                                  <Stack grow={12} horizontal className="borderBottom">
                                    <Stack>
                                      <Icon className="workflowIcon" iconName={log.Action == "Aprobar" ? "CheckMark" : "Cancel"} />
                                    </Stack>
                                    <Stack grow={10}>
                                      <Stack horizontal className="verticalPadding">
                                        <span> {log.User.Value + " - " + log.DateAndTimeAsString() + ` - ${strings.Action}: ` + log.Action}</span>
                                      </Stack>
                                      <Stack horizontal className="verticalPadding">
                                        <span hidden={CommonHelper.IsNullOrEmpty(log.Comments)}>{strings.Comments}: {log.Comments}</span>
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                </Stack>
                              );
                            })}
                          </Stack>
                        </Stack>
                      </div>
                    </Stack>
                  </PivotItem>
                  <PivotItem onRenderItemLink={this._customPromotionSummaryPivotItemRenderer}>
                    <Stack className="summarySectionContainer">
                      <Stack styles={this.repetitiveSectionStyle}>
                        <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                          <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                          <Stack className="label"> {strings.Status} </Stack>
                          <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>{entity.GetStatusText()}</Stack>
                        </Stack>
                        <Stack horizontal className="padding">
                          <Stack grow={8} verticalAlign="start" className="fixedStructure">
                            <Stack grow={12} className="grayContent padding padding-left padding-right">
                              <Stack horizontal className="verticalPadding borderBottom">
                                <Label> {strings.Customer} </Label>
                                <Label className="toRight">{entity.Client ? entity.Client.Name : null}</Label>
                              </Stack>
                              <Stack className="verticalPadding borderBottom">
                                <Label> {strings.ActivityObjective} </Label>
                                <span className="twoColumnsContentMaxWidth">{entity.ActivityObjective}</span>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack grow={4} horizontal className="fixedStructure">
                            <Stack grow={12} className="grayBorderLeft">
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel"> {strings.HeadOfChannel} </Label>
                                <div style={{ display: headOfChannel ? "block" : "none" }}>
                                  <Persona
                                    //TODO: Cargar imagen y account name
                                    //{...this.examplePersona}
                                    text={headOfChannel ? headOfChannel.Value : null}
                                    size={PersonaSize.size24}
                                    //presence={PersonaPresence.online}
                                    hidePersonaDetails={false}
                                    imageAlt={headOfChannel ? headOfChannel.Value : null}
                                  />
                                </div>
                              </Stack>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel"> {strings.ManagerKAM} </Label>
                                <div style={{ display: kam ? "block" : "none" }}>
                                  <Persona
                                    //TODO: Cargar imagen y account name
                                    text={kam ? kam.Value : null}
                                    size={PersonaSize.size24}
                                    //presence={PersonaPresence.online}
                                    hidePersonaDetails={false}
                                    imageAlt={kam ? kam.Value : null}
                                  />
                                </div>
                              </Stack>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel"> {strings.Channel} </Label>
                                <Label className="labelNotBold">{channel ? channel.Name : null}</Label>
                              </Stack>
                              <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                                <Label className="peopleLabel"> {strings.Subchannel} </Label>
                                <Label className="labelNotBold">{subchannel ? subchannel.Value : null}</Label>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                        {entity.Items.map((item, _index) => {
                          return (
                            <Stack className="padding-bottom">
                              <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                                <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding fixedStructure">
                                  <Icon iconName="DietPlanNotebook" />
                                  <Label>{strings.PreAnalysis} {item.AdditionalID}</Label>
                                </Stack>
                                <Stack grow={3} horizontalAlign="end" className="fixedStructure">
                                  <Label> {strings.EstimatedInvestment} </Label>
                                  <Label>{entity.Config.CurrencySymbol + " " + item.GetEstimatedInvestmentAsString()}</Label>
                                </Stack>
                                <Stack grow={3} horizontalAlign="end" className="fixedStructure">
                                  <Label> {strings.ROIEstimatedBySku} </Label>
                                  <Label>{item.GetROIAsString()}</Label>
                                </Stack>
                                <Stack grow={3} horizontalAlign="end" className="fixedStructure">
                                  <Label> {strings.Effectiveness} </Label>
                                  <div hidden={!item.IsEffective()} className="effectiveLabelContainer">
                                    <span className="effectiveLabel"> {strings.Effective} </span>
                                  </div>
                                  <div hidden={item.IsEffective()} className="effectiveLabelContainer">
                                    <span className="effectiveLabel notEffectiveLabel"> {strings.NotEffective} </span>
                                  </div>
                                </Stack>
                              </Stack>
                              <Stack horizontal className="grayContent padding padding-left padding-right">
                                <Stack className="smallPadding padding-right controlPadding fixedStructure" grow={4}>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.BaseVolume} </Label>
                                    <Label className="toRight">{item.GetBaseVolumeAsString()}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.VolumeLY} </Label>
                                    <Label className="toRight">{item.GetLastYearVolumeAsString()}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.NRBase} </Label>
                                    <Label className="toRight">{item.RequiresBaseNR() ? (entity.Config.CurrencySymbol + " " + item.GetBaseNRAsString()) : "N/A"}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.GMBase} </Label>
                                    <Label className="toRight">{item.RequiresBaseGM() ? (entity.Config.CurrencySymbol + " " + item.GetBaseGMAsString()) : "N/A"}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.AdditionalInvestmentMKT} </Label>
                                    <Label className="toRight">{item.GetAdditionalInvestmentAsString()}</Label>
                                  </Stack>
                                </Stack>
                                <Stack className="smallPadding padding-right fixedStructure" grow={4}>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.EstimatedIncrementalVolume} </Label>
                                    <Label className="toRight">{item.GetEstimatedIncrementalVolumeAsString()}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.VolumeAverageL3Months} </Label>
                                    <Label className="toRight">{item.GetAverageVolumeL3MonthsAsString()}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.EstimatedIncrementalNR} </Label>
                                    <Label className="toRight">{item.RequiresIncrementalEstimatedNR() ? (entity.Config.CurrencySymbol + " " + item.GetIncrementalEstimatedNRAsString()) : "N/A"}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.GMEstimatedPromo} </Label>
                                    <Label className="toRight">{item.RequiresEstimatedGMPromo() ? (entity.Config.CurrencySymbol + " " + item.GetEstimatedGMPromoAsString()) : "N/A"}</Label>
                                  </Stack>
                                </Stack>
                                <Stack className="smallPadding fixedStructure" grow={4}>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.TotalEstimatedVolume} </Label>
                                    <Label className="toRight">{item.RequiresTotalEstimatedVolume() ? item.GetTotalEstimatedVolumeAsString() : "N/A"}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.IncrementalVolume} </Label>
                                    <Label className="toRight">{item.RequiresIncrementalVolumePercentage() ? (item.GetIncrementalVolumePercentageAsString() + "%") : "N/A"}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.EstimatedNR} </Label>
                                    <Label className="toRight">{item.RequiresEstimatedNR() ? entity.Config.CurrencySymbol + " " + item.GetEstimatedNRAsString() : "N/A"}</Label>
                                  </Stack>
                                  <Stack horizontal className="verticalPadding borderBottom alignMiddle">
                                    <Label> {strings.IncrementalGM} </Label>
                                    <Label className="toRight">{item.RequiresIncrementalGM() ? (entity.Config.CurrencySymbol + " " + item.GetIncrementalGMAsString()) : "N/A"}</Label>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </PivotItem>
                  <PivotItem onRenderItemLink={entity.GetStatusId() == PromoStatus.Approved ? this._customPromotionEvidencePivotItemRenderer : null}>
                    <Stack className="evidenceSectionContainer">
                      <Stack styles={this.repetitiveSectionStyle}>
                        <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                          <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                          <Stack className="label"> {strings.Status}: </Stack>
                          <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>{entity.GetStatusText()}</Stack>
                        </Stack>
                        <Stack className="padding">
                          <Stack className="grayContent padding padding-left padding-right">
                            <Stack className="padding-bottom"> {strings.SectionUploadEvidence} </Stack>
                            <Stack className="multilineControlPadding">
                              <TextField
                                label={strings.Description}
                                multiline={true}
                                rows={3}
                                autoComplete="Off"
                                required={true}
                                onChange={this.onEvidenceDescriptionChange.bind(this)}
                                errorMessage={this.getEvidenceValidationErrorMessage(this.state.evidenceDescription)}
                              />
                            </Stack>
                            <Stack className="controlPadding" horizontal>
                              <Stack grow={4} className="fixedStructure">
                                <RBDatePicker
                                  label={strings.DateOfEvidence}
                                  onSelectDate={this.onSelectEvidenceDate.bind(this)}
                                  required={true}
                                  value={this.state.evidenceDate}
                                  errorMessage={this.getEvidenceValidationErrorMessage(this.state.evidenceDate)}
                                  minDate={entity.GetFromDate()}
                                  isDisabled={entity.Client == null} //Test
                                />
                              </Stack>
                              <Stack grow={8} className="fixedStructure"></Stack>
                            </Stack>
                            <Stack className="controlPadding" horizontal>
                              <input id="evidence_file_input" type="file" onChange={this.onFileChanged.bind(this)} hidden={true} />
                              <PrimaryButton text={strings.SelectFile}
                                style={{
                                  backgroundColor: "#425C68",
                                  border: "transparent"
                                }}
                                onClick={() => {
                                  if (!this.validateEvidence()) return;
                                  document.getElementById("evidence_file_input").click();
                                }}
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                        <Stack className="padding-bottom">
                          <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                            <Stack grow={12} horizontal className="verticalPadding preAnalisisPadding fixedStructure">
                              <Icon iconName="Attach" />
                              <Label> {strings.EvidenceFiles} </Label>
                            </Stack>
                          </Stack>
                          <Stack className="grayContent padding padding-left padding-right">
                            <table>
                              <thead>
                                <th> {strings.Filename} </th>
                                <th> {strings.Description} </th>
                                <th> {strings.Date} </th>
                                <th></th>
                              </thead>
                              <tbody>
                                {entity.Evidence.map((evidence, index) => {
                                  if (!evidence.Deleted) {
                                    return (
                                      <tr>
                                        <td>
                                          <div hidden={CommonHelper.IsNullOrEmpty(evidence.FileUrl)}>
                                            <Link href={evidence.FileUrl} target="_blank">{evidence.FileName}</Link>
                                          </div>
                                          <div hidden={!CommonHelper.IsNullOrEmpty(evidence.FileUrl)}>
                                            {evidence.FileName}
                                          </div>
                                        </td>
                                        <td>{evidence.Description}</td>
                                        <td>{CommonHelper.formatDate(evidence.Date)}</td>
                                        <td>
                                          <Stack className="label">
                                            <Link onClick={() => this.setState({ hideDeleteEvidenceDialog: false })}>
                                              <Icon iconName="MapLayers" /><span style={{ color: '#323130' }}> {strings.DeleteEvidence} </span>
                                            </Link>
                                          </Stack>
                                          <Dialog
                                            hidden={this.state.hideFileExistsMessageDialog}
                                            dialogContentProps={this.fileExistsDialogContentProps}
                                            styles={this.confirmationDialogStyles}
                                            onDismiss={() => this.setState({ hideFileExistsMessageDialog: true })}>
                                            <DialogFooter>
                                              <DefaultButton onClick={() => {
                                                this.setState({ hideFileExistsMessageDialog: true });
                                              }}
                                                text="OK" />
                                            </DialogFooter>
                                          </Dialog>
                                          <Dialog
                                            hidden={this.state.hideDeleteEvidenceDialog}
                                            dialogContentProps={this.deleteEvidenceDialogContentProps}
                                            styles={this.confirmationDialogStyles}
                                            onDismiss={() => this.setState({ hideDeleteEvidenceDialog: true })}>
                                            <DialogFooter>
                                              <PrimaryButton onClick={() => {
                                                this.setState((state) => {
                                                  let newState = state as IPromoFormState;
                                                  let currentEvidence = newState.viewModel.Entity.Evidence[index];

                                                  if (currentEvidence.File) {
                                                    newState.viewModel.Entity.Evidence.splice(index, 1);
                                                  }
                                                  else {
                                                    newState.viewModel.Entity.Evidence[index].Deleted = true;
                                                  }

                                                  newState.hideDeleteEvidenceDialog = true;

                                                  return newState;
                                                });
                                              }}
                                                text={strings.Remove}
                                                style={{
                                                  backgroundColor: "#425C68",
                                                  border: "transparent"
                                                }}
                                              />
                                              <DefaultButton onClick={() => {
                                                this.setState({ hideDeleteEvidenceDialog: true });
                                              }}
                                                text={strings.Cancel} />
                                            </DialogFooter>
                                          </Dialog>
                                        </td>
                                      </tr>
                                    );
                                  }
                                })}
                              </tbody>
                            </table>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </PivotItem>
                </Pivot>
              </Stack >

              {/* Fin Modal Content*/}

              {/* Modal Bottom*/}

              <div className="modalBottom">
                <Stack className="borderBottom">
                  <Label> {strings.GeneralStateOfThePromotion} </Label>
                </Stack>
                <Stack className="modalBottomContent verticalPadding" horizontal grow={12}>
                  <Stack grow={1}>
                    <Label className="modalBottomContentHeader"> {strings.Effectiveness} </Label>
                    <div hidden={!entity.IsEffective()} className="effectiveLabelContainer">
                      <span className="effectiveLabel"> {strings.Effective} </span>
                    </div>
                    <div hidden={entity.IsEffective()} className="effectiveLabelContainer">
                      <span className="effectiveLabel notEffectiveLabel"> {strings.NotEffective} </span>
                    </div>
                  </Stack>
                  <Stack grow={1} className="fixedStructure">
                    <Label className="modalBottomContentHeader"> {strings.TotalEstimatedROI} </Label>
                    <Label className="modalBottomContentValue">{entity.GetROIAsString()}</Label>
                  </Stack>
                  <Stack grow={1} className="fixedStructure">
                    <Label className="modalBottomContentHeader"> {strings.TotalEstimatedInvestment} </Label>
                    <Label className="modalBottomContentValue">{entity.Config.CurrencySymbol + " " + entity.GetTotalEstimatedInvestmentAsString()}</Label>
                  </Stack>
                  <Stack grow={2} className="modalBottomButtonsContainer fixedStructure" horizontal horizontalAlign="end">
                    <Stack grow={6} className="fixedStructure">
                      <DefaultButton
                        style={{ display: this.state.viewModel.ShowSaveButton ? "block" : "none" }}
                        text={strings.SaveDraft}
                        allowDisabledFocus
                        onClick={this.save.bind(this)}
                        disabled={!this.state.enableSubmit || entity.Client == null} />
                      <PrimaryButton
                        style={{
                          display: this.state.viewModel.ShowApproveButton ? "block" : "none",
                          backgroundColor: "#425C68",
                          border: "transparent"
                        }}
                        text={strings.Approve}
                        allowDisabledFocus
                        onClick={this.approve.bind(this)}
                      />
                      <Dialog
                        hidden={this.state.hideSavingSpinnerConfirmationDialog}
                        dialogContentProps={this.savingSpinnerModalDialogContentProps}
                        styles={this.confirmationDialogStyles} >
                        <div>
                          <Spinner label={strings.Saving} />
                        </div>
                      </Dialog>

                      {/* //TODO Dialog al cargar peticiones */}
                      <Dialog
                        hidden={this.state.hideLoading}
                        dialogContentProps={this.savingSpinnerModalDialogContentProps}
                        styles={this.confirmationDialogStyles} >
                        <div>
                          <Spinner label="Cargando... Por favor espere" />
                        </div>
                      </Dialog>

                      <Dialog
                        hidden={this.state.hideActionConfirmationDialog}
                        styles={{ main: { width: '450px important!' } }}
                        className="workflowCommentsModal"
                        dialogContentProps={{
                          title: this.state.actionConfirmationDialogTitle
                        }}>
                        <Stack>
                          <Stack className="controlPadding">
                            <TextField
                              label={strings.Comments + (this.state.actionConfirmationDialogType == ActionConfirmationType.Approve ? ` ${strings.Optional}` : "")}
                              required={this.state.actionConfirmationDialogType == ActionConfirmationType.Reject}
                              multiline={true}
                              value={this.state.actionsComments}
                              onChange={this.onActionCommentsChange.bind(this)}
                              rows={6}
                              autoComplete="Off"
                              errorMessage={this.state.enableActionValidation && CommonHelper.IsNullOrEmpty(this.state.actionsComments) ? Constants.Messages.RequiredField : ""}
                            />
                          </Stack>
                          <Stack horizontal className="smallPadding toRight">
                            <Stack className="padding-right">
                              <PrimaryButton
                                text={strings.Confirm}
                                allowDisabledFocus
                                onClick={this.confirmAction.bind(this)}
                                disabled={!this.state.enableSubmit}
                                style={{
                                  backgroundColor: "#425C68",
                                  border: "transparent"
                                }}
                              />
                            </Stack>
                            <Stack>
                              <DefaultButton
                                text={strings.Cancel}
                                allowDisabledFocus
                                onClick={() => {
                                  this.setState({
                                    hideActionConfirmationDialog: true,
                                    actionsComments: CommonHelper.EmptyString,
                                    enableActionValidation: false
                                  });
                                }}
                                disabled={!this.state.enableSubmit}
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                      </Dialog>
                    </Stack>
                    <Stack grow={6} className="fixedStructure">
                      <PrimaryButton
                        style={{
                          display: this.state.viewModel.ShowSubmitButton ? "block" : "none",
                          backgroundColor: "#425C68",
                          border: "transparent"
                        }}
                        text={strings.SendForApproval}
                        allowDisabledFocus
                        onClick={this.submit.bind(this)}
                        disabled={!this.state.enableSubmit}
                      />
                      <DefaultButton
                        style={{ display: this.state.viewModel.ShowRejectButton ? "block" : "none" }}
                        text={strings.Reject}
                        allowDisabledFocus
                        onClick={this.reject.bind(this)}
                      />
                      <PrimaryButton
                        style={{
                          display: (this.state.viewModel.ShowEvidenceButton
                            && entity.EvidenceHasChanges()
                            && this.state.enableSubmit)
                            ? "block" : "none",
                          backgroundColor: "#425C68",
                          border: "transparent"
                        }}
                        text={strings.UpdateEvidence}
                        allowDisabledFocus
                        onClick={this.updateEvidence.bind(this)}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </div>

              {/* Fin Modal Bottom*/}
            </Shimmer>
          </Modal>
        </div>;
    }

    if (this.state.formSubmitted) {
      output =
        <PromoFormResult
          title={this.props.title}
          close={this.props.close}
          message={this.state.resultIsOK ? strings.OperationCompletedCorrectly : `${strings.ErrorExecutingOperation}: ` + this.state.errorMessage}
          isSuccess={this.state.resultIsOK} />;
    }

    return output;
  }

  //#region Header events

  private onCloseModal() {
    if (!this.state.viewModel.ReadOnlyForm)
      this.setState({ hideModalConfirmationDialog: false });
    else
      this.props.close();
  }

  private onNameChange(_event: any, text?: string) {
    const client = this.state.viewModel.Entity.Client;

    this.setState((state) => {
      let newState = state as IPromoFormState;

      newState.promotionTitle = client && text ? client.Name + " - " + text : strings.NewPromotion; //Nueva promoción
      newState.viewModel.Entity.Name = text;

      return newState;
    });
  }

  private onActivityObjectiveChange(_event: any, text: any) {
    this.setState((state) => {
      state.viewModel.Entity.ActivityObjective = text;
      return state;
    });
  }




  private onClientChanged(item: IDropdownOption) {
    const clientId = item.key as number;

    this.setState((state) => {
      state.viewModel.Entity.Client = new Client({ ItemId: clientId, Name: item.text });
      return state;
    }, () => {
      this.state.viewModel.Entity.Items.map((promoitem: PromoItem, index: number) => {
        this.updateClientProductFields(index);
      });
    });

    this.setState({
      hideLoading: false
    });

    ClientRepository.GetById(clientId).then((client) => {
      this.setState((state) => {
        let newState = state as IPromoFormState;
        newState.viewModel.Entity.Client = client;
        /*Seleccionar el cliente busca la lista del cliente seleccionado
          Actualiza los productos por el cliente seleccionado
        */
        ClientProductRepository.GetAll(this.state.viewModel.Entity.Client.Name).then((products) => {
          newState.viewModel.ClientProducts = products;
          state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit = null;
          state.viewModel.Entity.Items[this.state.selectedIndex].Brand = null;
          state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory = null;
          state.viewModel.Entity.Items[this.state.selectedIndex].Category = null;

          this.setState({
            hideLoading: true
          });

        });
        return newState;
      });
    });

    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].ClientProduct = null;
      state.viewModel.Entity.Items[this.state.selectedIndex].Client = item.key ? new LookupValue({
        ItemId: item.key as number,
        Value: item.text
      }) : null;
      return state;
    });



  }

  //#endregion

  //#region Tabs

  private AddPromoItem() {
    let items = this.state.viewModel.Entity.Items;
    const index = items.length + 1;

    /*items.push(new PromoItem({
      AdditionalID: this.state.viewModel.Entity.PromoID + "." + index,
      GetBaseGMSum: this.state.viewModel.Entity.GetBaseGMSum.bind(this.state.viewModel.Entity)
    }));*/
    items.push(new PromoItem({
      AdditionalID: this.state.viewModel.Entity.PromoID + "." + index,
      GetBaseGMSum: this.state.viewModel.Entity.GetBaseGMSum.bind(this.state.viewModel.Entity),
      ShortDescription: "",
      Category: null, //Test -> items[this.state.selectedIndex].Category
      Investment: null,
      Type: null, //Test -> items[this.state.selectedIndex].Type
      CappedActivity: null, //Test -> items[this.state.selectedIndex].CappedActivity
      BusinessUnit: null, //Test -> items[this.state.selectedIndex].BusinessUnit
      Brand: null,
      ProductCategory: null, //Test -> items[this.state.selectedIndex].ProductCategory
      ClientProduct: null,
      //Product: null,
      StartDate: items[this.state.selectedIndex].StartDate,
      EndDate: items[this.state.selectedIndex].EndDate,
      DiscountPerPiece: null,
      NetPrice: items[this.state.selectedIndex].NetPrice,
      COGS: items[this.state.selectedIndex].COGS,
      Redemption: null,
      BaseVolume: null,
      EstimatedIncrementalVolume: null,
      AdditionalInvestment: null
    }));


    let customerAux = {
      key: this.state.viewModel.Entity.Client.ItemId,
      text: this.state.viewModel.Entity.Client.Name
    }


    this.setState((state) => {
      let newState = state as IPromoFormState;
      newState.viewModel.Entity.Items = items;
      newState.selectedIndex = items.length - 1;

      //Test -> Agregar nuevo item y actualizar el estado para la lista de unidades de negocio
      newState.viewModel.Entity.Items[this.state.selectedIndex].ClientProduct = null;
      newState.viewModel.Entity.Items[this.state.selectedIndex].Client = customerAux.key ? new LookupValue({
        ItemId: customerAux.key as number,
        Value: customerAux.text as string
      }) : null;

      return newState;
    });



  }



  //TODO: RemovePromoItem
  private RemovePromoItem() {

    let toDelete = this.state.viewModel.Entity.Items[this.state.selectedIndex];

    if (!this.arrayPromoItemsDelete.includes(toDelete.ItemId) && toDelete.ItemId !== undefined) {
      this.arrayPromoItemsDelete.push(toDelete.ItemId);
    }

    let items = this.state.viewModel.Entity.Items;
    items.splice(this.state.selectedIndex, 1);

    items.map((item, index) => {
      item.AdditionalID = this.state.viewModel.Entity.PromoID + "." + (index + 1);
    });

    this.setState((state) => {
      let newState = state as IPromoFormState;
      newState.viewModel.Entity.Items = items;
      newState.viewModel.Entity.ItemsToDelete = this.arrayPromoItemsDelete;
      newState.selectedIndex = 0;
      newState.hideDeleteProductDialog = true;
      return newState;
    });
  }


  private onTabLinkClicked(item?: PivotItem) {
    if (item.props.itemKey == "ADD") {
      this.AddPromoItem();
    } else {
      this.changeSelectedItem(parseInt(item.props.itemKey));
    }
  }

  private changeSelectedItem(index: number) {
    this.setState({
      selectedIndex: index,
      loadingTypes: true
    });

    const category = this.state.viewModel.Entity.Items[index].Category;
    if (category != null) {
      PromoService.GetTypesByCategory(category.ItemId).then((types: Type[]) => {
        this.setState({ loadingTypes: false });
        this.setState((state) => {
          state.viewModel.Types = types;
          return state;
        });
      });
    }
  }

  //#endregion

  //#region Promo item - General

  private onShortDescriptionChange(_event: any, text: any) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].ShortDescription = text;
      return state;
    });
  }

  private onCategoryChanged(item: IDropdownOption) {
    const promoItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];

    promoItem.Category = this.state.viewModel.Categories.filter(x => x.ItemId === item.key as number)[0];
    promoItem.Type = null;
    promoItem.Redemption = null;

    if (!promoItem.RequiresInvestment())
      promoItem.Investment = null;

    if (!promoItem.RequiresDiscountPerPiece())
      promoItem.DiscountPerPiece = null;

    this.setState((prevState) => {
      let newState = prevState as IPromoFormState;

      newState.loadingTypes = true;
      newState.viewModel.Entity.Items[this.state.selectedIndex] = promoItem;

      return newState;
    }, () => {
      this.updateClientProductFields(this.state.selectedIndex);
    });

    PromoService.GetTypesByCategory(promoItem.Category.ItemId).then((types: Type[]) => {
      this.setState((state) => {
        let newState = state as IPromoFormState;

        newState.loadingTypes = false;
        newState.viewModel.Types = types;

        return newState;
      });
    });
  }

  private onInvestmentChange(_event: any, text: any) {
    if (CommonHelper.IsNullOrEmpty(text) || CommonHelper.isValidDecimal(text, 2)) {
      this.setState((state) => {
        state.viewModel.Entity.Items[this.state.selectedIndex].Investment = !isNaN(parseFloat(text)) ? parseFloat(text) : null;
        return state;
      });
    }
  }

  private onTypeChanged(item: IDropdownOption) {
    const promoItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];

    promoItem.Type = this.state.viewModel.Types.filter(x => x.ItemId === item.key as number)[0];
    promoItem.Redemption = null;

    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex] = promoItem;
      return state;
    });
  }

  private onCappedActivityChanged(_ev: React.MouseEvent<HTMLElement>, checked: boolean) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].CappedActivity = checked;
      return state;
    });
  }

  //#endregion

  //#region Promo item - Product

  private GetFilteredCLients(): LookupValue[] {
    const filteresClients: LookupValue[] = [];
    const map = new Map();

    for (const item of this.GetFilteredProducts().map((p) => p.Client)) {
      if (!map.has(item.ItemId)) {
        map.set(item.ItemId, true);
        filteresClients.push(item);
      }
    }

    filteresClients.sort((a, b) => a.Value > b.Value ? 1 : -1);


    return filteresClients;
  }

  /*private GetFilteredProducts(): Product[] {
    const selectedItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];
    let filteredProducts = this.state.viewModel.Products || [];

    if (selectedItem.BusinessUnit)
      filteredProducts = filteredProducts.filter(x => x.BusinessUnit.ItemId === selectedItem.BusinessUnit.ItemId);

    if (selectedItem.Brand)
      filteredProducts = filteredProducts.filter(x => x.Brand.ItemId === selectedItem.Brand.ItemId);

    if (selectedItem.ProductCategory)
      filteredProducts = filteredProducts.filter(x => x.Category.ItemId === selectedItem.Category.ItemId);

    return filteredProducts;
  }*/

  private GetFilteredProducts(): ClientProduct[] {
    const selectedItem = this.state.viewModel.Entity.Items[this.state.selectedIndex];
    let filteredProducts = this.state.viewModel.ClientProducts || [];

    // console.log(this.state.viewModel);
    // console.log(this.state.viewModel.Entity.Items[this.state.selectedIndex]);
    // console.log(this.state.viewModel.Entity.Client);
    // console.log(this.state.viewModel.ClientProducts);

    // Mostrar los productos que tiene un cliente si hay un cliente seleccionado
    if (this.state.viewModel.Entity.Client == null || this.state.viewModel.Entity.Client == undefined) {
      filteredProducts = [];
    } else {
      filteredProducts = this.state.viewModel.ClientProducts;
    }

    if (selectedItem.BusinessUnit)
      filteredProducts = filteredProducts.filter(x => x.BusinessUnit.ItemId === selectedItem.BusinessUnit.ItemId);

    if (selectedItem.Brand)
      filteredProducts = filteredProducts.filter(x => x.Brand.ItemId === selectedItem.Brand.ItemId);

    if (selectedItem.ProductCategory)
      filteredProducts = filteredProducts.filter(x => x.Category.ItemId === selectedItem.ProductCategory.ItemId);


    return filteredProducts;
  }



  private GetFilteredBrands(): LookupValue[] {
    const filteredBrands: LookupValue[] = [];
    const map = new Map();

    for (const item of this.GetFilteredProducts().map((p) => p.Brand)) {
      if (!map.has(item.ItemId)) {
        map.set(item.ItemId, true);
        filteredBrands.push(item);
      }
    }

    filteredBrands.sort((a, b) => a.Value > b.Value ? 1 : -1);

    if (this.state.viewModel.Entity.Items[this.state.selectedIndex].Brand != null)
      filteredBrands.unshift(new LookupValue({ Value: Constants.Miscellaneous.ClearSelectionText }));

    return filteredBrands;
  }


  //todo GetFilteredBUs
  private GetFilteredBUs(): LookupValue[] {
    const filteredBUs: LookupValue[] = [];
    const map = new Map();

    for (const item of this.GetFilteredProducts().map((p) => p.BusinessUnit)) {
      if (!map.has(item.ItemId)) {
        map.set(item.ItemId, true);
        filteredBUs.push(item);
      }
    }

    filteredBUs.sort((a, b) => a.Value > b.Value ? 1 : -1);

    if (this.state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit != null)
      filteredBUs.unshift(new LookupValue({ Value: Constants.Miscellaneous.ClearSelectionText }));

    return filteredBUs;
  }



  private GetFilteredProductCategories(): LookupValue[] {
    const filteredCategories: LookupValue[] = [];
    const map = new Map();

    for (const item of this.GetFilteredProducts().map((p) => p.Category)) {
      if (!map.has(item.ItemId)) {
        map.set(item.ItemId, true);
        filteredCategories.push(item);
      }
    }

    filteredCategories.sort((a, b) => a.Value > b.Value ? 1 : -1);

    if (this.state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory != null)
      filteredCategories.unshift(new LookupValue({ Value: Constants.Miscellaneous.ClearSelectionText }));

    return filteredCategories;
  }

  private onBusinessUnitChanged(item: IDropdownOption) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].ClientProduct = null;
      state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit = item.key ? new LookupValue({
        ItemId: item.key as number,
        Value: item.text
      }) : null;
      return state;
    });
  }

  private onBrandChanged(item: IDropdownOption) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].ClientProduct = null;
      state.viewModel.Entity.Items[this.state.selectedIndex].Brand = item.key ? new LookupValue({
        ItemId: item.key as number,
        Value: item.text
      }) : null;
      return state;
    });
  }

  private onProductCategoryChanged(item: IDropdownOption) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].ClientProduct = null;
      state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory = item.key ? new LookupValue({
        ItemId: item.key as number,
        Value: item.text
      }) : null;
      return state;
    });
  }

  private onProductChanged(productId: number) {
    const product = this.state.viewModel.ClientProducts.filter(x => x.ItemId === productId)[0];
    //console.log(product, product.SKUNumber);
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].ClientProduct = product;
      //state.viewModel.Entity.Items[this.state.selectedIndex].Client = product.Client;
      state.viewModel.Entity.Items[this.state.selectedIndex].BusinessUnit = product.BusinessUnit;
      state.viewModel.Entity.Items[this.state.selectedIndex].Brand = product.Brand;
      state.viewModel.Entity.Items[this.state.selectedIndex].ProductCategory = product.Category;
      return state;
    }, () => {
      this.updateClientProductFields(this.state.selectedIndex);
    });
  }

  private onSelectStartDate(date: Date | null | undefined): void {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].StartDate = date;
      return state;
    });
  }

  private onSelectEndDate(date: Date | null | undefined): void {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].EndDate = date;
      return state;
    });
  }

  private updateClientProductFields(itemIndex: number) {
    let promoItem = this.state.viewModel.Entity.Items[itemIndex];
    const client = this.state.viewModel.Entity.Client;
    //const product = promoItem.Product;
    const product = promoItem.ClientProduct;
    const skunumber = promoItem.ClientProduct;
    let clientName = this.state.viewModel.Entity.Client.Name;

    if (client && product) {
      ClientProductRepository.GetByClientAndProduct(client.ItemId, skunumber.SKUNumber, clientName).then((item: ClientProduct) => {
        promoItem.NetPrice = promoItem.RequiresNetPrice() && item ? item.Price : null;
        promoItem.COGS = item ? item.COGS : null;

        this.setState((state) => {
          state.viewModel.Entity.Items[itemIndex] = promoItem;
          return state;
        });
      });

      LastYearVolumesRepository.GetByClientAndProduct(client.ItemId, product.ItemId).then((item: LastYearVolumes) => {
        this.setState((state) => {
          state.viewModel.Entity.Items[itemIndex].LastYearVolumes = item;
          return state;
        });
      });
    }
    else {
      promoItem.NetPrice = null;
      promoItem.COGS = null;

      this.setState((state) => {
        state.viewModel.Entity.Items[itemIndex] = promoItem;
        return state;
      });
    }
  }

  //#endregion

  //#region Input - Pre analisis

  private onDiscountPerPieceChange(_event: any, text: any) {
    if (CommonHelper.IsNullOrEmpty(text) || CommonHelper.isValidDecimal(text, 2)) {
      this.setState((state) => {
        state.viewModel.Entity.Items[this.state.selectedIndex].DiscountPerPiece = !isNaN(parseFloat(text)) ? parseFloat(text) : null;
        return state;
      });
    }
  }

  private onRedemptionChange(_event: any, text: any) {
    if (CommonHelper.IsNullOrEmpty(text) || CommonHelper.isValidDecimal(text, 2)) {
      this.setState((state) => {
        state.viewModel.Entity.Items[this.state.selectedIndex].Redemption = !isNaN(parseFloat(text)) ? parseFloat(text) : null;
        return state;
      });
    }
  }

  private onBaseVolumeChange(_event: any, text: any) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].BaseVolume = !isNaN(parseInt(text)) ? parseInt(text) : null;
      return state;
    });
  }

  private onAdditionalInvestmentChange(_event: any, text: any) {
    if (CommonHelper.IsNullOrEmpty(text) || CommonHelper.isValidDecimal(text, 2)) {
      this.setState((state) => {
        state.viewModel.Entity.Items[this.state.selectedIndex].AdditionalInvestment = !isNaN(parseFloat(text)) ? parseFloat(text) : null;
        return state;
      });
    }
  }

  private onEstimatedIncrementalVolumeChange(_event: any, text: any) {
    this.setState((state) => {
      state.viewModel.Entity.Items[this.state.selectedIndex].EstimatedIncrementalVolume = !isNaN(parseInt(text)) ? parseInt(text) : null;
      return state;
    });
  }

  //#endregion

  //#region  Evidencias

  private onFileChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const self = this;

    let promoEvidence = this.state.viewModel.Entity.Evidence;

    if (event.target && event.target.files[0]) {
      let file = event.target.files[0];
      let reader = new FileReader();

      reader.addEventListener("loadend", () => {
        let evidence = new PromoEvidence();
        let fileExists = false;

        promoEvidence.map((ev) => {
          if (ev.FileName == file.name) {
            fileExists = true;
            return;
          }
        });

        if (!fileExists) {
          evidence.File = file;
          evidence.FileName = file.name;
          evidence.Description = this.state.evidenceDescription;
          evidence.Date = this.state.evidenceDate;

          promoEvidence.push(evidence);

          this.setState((state) => {
            state.viewModel.Entity.Evidence = promoEvidence;
            return state;
          });
        }
        else {
          this.setState({ hideFileExistsMessageDialog: false });
        }

        (document.getElementById("evidence_file_input") as HTMLInputElement).value = "";
      });

      reader.readAsDataURL(file);
    }
  }

  private onEvidenceDescriptionChange(_event: any, text: any) {
    this.setState({
      evidenceDescription: text
    });
  }

  private onSelectEvidenceDate(date: Date | null | undefined): void {
    this.setState({
      evidenceDate: date
    });
  }

  private updateEvidence(): void {
    const entity = this.state.viewModel.Entity;

    this.setState({
      enableSubmit: false,
      hideSavingSpinnerConfirmationDialog: false
    });

    PromoService.UpdateEvidence(entity.PromoID, entity.Evidence).then(() => {
      this.setState({
        formSubmitted: true,
        resultIsOK: true
      });
    }).catch((err) => {
      console.error(err);
      this.setState({ formSubmitted: true, errorMessage: err });
    });
  }

  //#endregion

  //#region Actions

  private copyPromo(): void {
    if (!this.validateFormControls()) return;

    this.setState({
      enableSubmit: false,
      hideSavingSpinnerConfirmationDialog: false
    });

    const dato = this.state.viewModel.Entity;;
    dato.ChangeState(PromoStatus.New);
    dato.ItemId = undefined;

    dato.Items.map((item) => {
      item.ItemId = null;
      item.AdditionalID = "--" + "." + item.AdditionalID.split('.')[1];
      item.StartDate = undefined;
      item.EndDate = undefined;
    });

    PromoService.Save(dato).then(() => {
      this.setState({
        formSubmitted: true,
        resultIsOK: true
      });
    }).catch((err) => {
      console.error(err);
      this.setState({ formSubmitted: true, errorMessage: err });
    });
  }



  //TODO: save
  private save(): void {

    if (!this.validateFormControls()) return;

    this.setState({
      enableSubmit: false,
      hideSavingSpinnerConfirmationDialog: false
    });


    PromoService.Save(this.state.viewModel.Entity).then(() => {
      this.setState({
        formSubmitted: true,
        resultIsOK: true
      });
    }).catch((err) => {
      console.error(err);
      this.setState({ formSubmitted: true, errorMessage: err });
    });
  }



  private submit(): void {

    if (!this.validateFormControls()) return;

    this.setState({
      enableSubmit: false,
      hideSavingSpinnerConfirmationDialog: false
    });

    PromoService.Submit(this.state.viewModel.Entity).then(() => {
      this.setState({
        formSubmitted: true,
        resultIsOK: true
      });
    }).catch((err) => {
      console.error(err);
      this.setState({ formSubmitted: true, errorMessage: err });
    });
  }

  private approve(): void {
    this.setState({
      actionConfirmationDialogTitle: strings.Approve,
      actionConfirmationDialogType: ActionConfirmationType.Approve,
      hideActionConfirmationDialog: false
    });
  }

  private reject(): void {
    this.setState({
      actionConfirmationDialogTitle: strings.Reject,
      actionConfirmationDialogType: ActionConfirmationType.Reject,
      hideActionConfirmationDialog: false
    });
  }

  private onActionCommentsChange(_event: any, text: any) {
    this.setState({ actionsComments: text });
  }

  private confirmAction(): void {
    if (this.state.actionConfirmationDialogType == ActionConfirmationType.Approve) {
      this.setState({
        enableSubmit: false,
        hideActionConfirmationDialog: true,
        hideSavingSpinnerConfirmationDialog: false
      });

      PromoService.Approve(this.state.viewModel.Entity, this.state.actionsComments).then(() => {
        this.setState({
          formSubmitted: true,
          resultIsOK: true
        });
      }).catch((err) => {
        console.error(err);
        this.setState({ formSubmitted: true, errorMessage: err });
      });
    }
    else {
      this.setState({ enableActionValidation: true });

      if (!CommonHelper.IsNullOrEmpty(this.state.actionsComments)) {
        this.setState({
          enableSubmit: false,
          hideActionConfirmationDialog: true,
          hideSavingSpinnerConfirmationDialog: false
        });

        PromoService.Reject(this.state.viewModel.Entity, this.state.actionsComments).then(() => {
          this.setState({
            formSubmitted: true,
            resultIsOK: true
          });
        }).catch((err) => {
          console.error(err);
          this.setState({ formSubmitted: true, errorMessage: err });
        });
      }
      else
        return;
    }
  }

  //#endregion

  private getValidationErrorMessage(value: any): string {
    if (value == undefined)
      return this.state.hasValidationError ? Constants.Messages.RequiredField : CommonHelper.EmptyString;

    if (typeof value === "string")
      return this.state.hasValidationError && CommonHelper.IsNullOrEmpty(value) ? Constants.Messages.RequiredField : CommonHelper.EmptyString;

    if (CommonHelper.IsArray(value))
      return this.state.hasValidationError && value.length == 0 ? Constants.Messages.RequiredField : CommonHelper.EmptyString;

    return CommonHelper.EmptyString;
  }

  private validateFormControls(): boolean {
    var invalidCount = 0;

    if (CommonHelper.IsNullOrEmpty(this.state.viewModel.Entity.ActivityObjective)) invalidCount++;
    if (this.state.viewModel.Entity.Client == null) invalidCount++;

    this.state.viewModel.Entity.Items.map((item) => {
      if (!item.IsValid()) invalidCount++;
    });

    this.setState({ hasValidationError: invalidCount > 0 });

    return invalidCount == 0;
  }

  private validateEvidence(): boolean {
    var invalidCount = 0;

    if (CommonHelper.IsNullOrEmpty(this.state.evidenceDescription)) invalidCount++;
    if (!CommonHelper.IsDate(this.state.evidenceDate)) invalidCount++;

    this.setState({ hasEvidenceValidatioNError: invalidCount > 0 });

    return invalidCount == 0;
  }

  private getEvidenceValidationErrorMessage(value: any): string {
    if (value == undefined)
      return this.state.hasEvidenceValidatioNError ? Constants.Messages.RequiredField : CommonHelper.EmptyString;

    if (typeof value === "string")
      return this.state.hasEvidenceValidatioNError && CommonHelper.IsNullOrEmpty(value) ? Constants.Messages.RequiredField : CommonHelper.EmptyString;

    if (CommonHelper.IsArray(value))
      return this.state.hasEvidenceValidatioNError && value.length == 0 ? Constants.Messages.RequiredField : CommonHelper.EmptyString;

    return CommonHelper.EmptyString;
  }

  private _getShimmerStyles = (_props: IShimmerStyleProps): IShimmerStyles => {
    return {
      shimmerWrapper: [
        {
          backgroundColor: '#deecf9',
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #c7e0f4 50%, rgba(255, 255, 255, 0) 100%)'
        }
      ]
    };
  }

  // New part

  private contentStyles = mergeStyleSets({
    header: [
      // eslint-disable-next-line deprecation/deprecation
      theme.fonts.xLargePlus,
      {
        flex: '1 1 auto',
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ]
  });

  private cancelIcon: IIconProps = { iconName: 'Cancel' };

  private iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };

  private repetitiveSectionStyle: IStackStyles = {
    root: {
      minHeight: 320,
    },
  };

  private confirmationDialogStyles = { main: { maxWidth: '450px' } };

  private _customPromotionPivotItemRenderer(promoID: string, link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="DietPlanNotebook" /></Label>
        <Label>{strings.IDPromotion}&nbsp;:&nbsp;</Label>
        <Label style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>{promoID}</Label>
      </Stack>
    );
  }

  private _customPromotionSummaryPivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="DietPlanNotebook" /></Label>
        <Label> {strings.Summary} </Label>
      </Stack>
    );
  }

  private _customPromotionEvidencePivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal hidden={true}>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="Attach" /></Label>
        <Label> {strings.Evidences} </Label>
      </Stack>
    );
  }

  private wrapperClass = mergeStyles({
    padding: 2,
    selectors: {
      '& > .ms-Shimmer-container': {
        margin: '10px 0',
      },
    },
  });

  private getCustomShimmerElementsGroup = (): JSX.Element => {
    return (
      <div style={{ display: 'flex' }} className={this.wrapperClass}>
        {/* <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.gap, width: 10, height: 80 },
            { type: ShimmerElementType.circle, height: 80 },
            { type: ShimmerElementType.gap, width: 10, height: 80 },
          ]}
        /> */}
        {/* <ShimmerElementType
          flexWrap
          className="padding"
          shimmerElements={[
            { type: ShimmerElementType.line, width: 360, height: 30 },
              { type: ShimmerElementType.gap, width: 30, height: 30 },
              { type: ShimmerElementType.line, width: 360, height: 30 },
              { type: ShimmerElementType.gap, width: 30, height: 30 },
              { type: ShimmerElementType.line, width: 360, height: 30 },
            // { type: ShimmerElementType.line, width: 500, height: 20 },
          ]}
        /> */}
      </div>
    );
  }

  private deleteProductDialogContentProps = {
    type: DialogType.normal,
    title: strings.DeleteProduct,
    closeButtonAriaLabel: 'Cerrar',
    subText: strings.ConfirmDeleteProduct,
  };

  private deleteEvidenceDialogContentProps = {
    type: DialogType.normal,
    title: strings.DeleteEvidence,
    closeButtonAriaLabel: 'Cerrar',
    subText: strings.ConfirmDeleteEvidence,
  };

  private fileExistsDialogContentProps = {
    type: DialogType.normal,
    title: strings.ExistingFile,
    closeButtonAriaLabel: 'Cerrar',
    subText: strings.AlreadyFileWithThisName
  };

  private closeModalDialogContentProps = {
    type: DialogType.normal,
    title: strings.ExitWithoutSave,
    closeButtonAriaLabel: 'Cerrar',
    subText: strings.ConfirmSaveExit,
  };

  private savingSpinnerModalDialogContentProps = {
    type: DialogType.largeHeader,
  };
}
