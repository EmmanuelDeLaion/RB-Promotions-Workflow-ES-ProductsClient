import * as React from 'react';
import { Pivot, PivotItem, IPivotItemProps } from "@fluentui/react-tabs";
import { TestImages } from '@uifabric/example-data';
import { IMockupFormProps } from './IMockupFormProps';
import { IMockupFormState } from './IMockupFormState';

import {
  Modal,
  mergeStyleSets,
  IconButton,
  IIconProps,
  FontWeights,
  getTheme,
  Label,
  Stack,
  DefaultButton,
  PrimaryButton,
  Separator,
  Icon,
  TextField,
  ComboBox,
  Persona,
  Link,
  IStackStyles,
  IStyleSet,
  ILabelStyles,
  PersonaSize,
  IPersonaSharedProps,
  IComboBoxOption,
  PersonaPresence,
  Dialog,
  DialogFooter,
  DialogType,
  DayOfWeek,
  DatePicker,
  IDatePickerStrings,
  Toggle
} from 'office-ui-fabric-react';

require('./MockupForm.css');

import { initializeTheme } from './Theme';
initializeTheme();
const theme = getTheme();

{/* Modal */ }
const contentStyles = mergeStyleSets({
  modal: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
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

{/* Fin Modal */ }


{/* Header */ }

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const iconButtonStyles = {
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

{/* Fin Header */ }

{/* Content */ }

const repetitiveSectionStyle: IStackStyles = {
  root: {
    minHeight: 320,
  },
};

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};

const examplePersona: IPersonaSharedProps = {
  imageUrl: TestImages.personaMale,
  imageInitials: 'JS',
  text: 'John Smith',
  secondaryText: 'Cabeza de Canal',
  tertiaryText: 'In a meeting',
  optionalText: 'Available at 4:00pm',
};

const examplePersona2: IPersonaSharedProps = {
  imageUrl: TestImages.personaFemale,
  imageInitials: 'AL',
  text: 'Annie Lindqvist',
  secondaryText: 'Gerente KAM',
  tertiaryText: 'In a meeting',
  optionalText: 'Available at 4:00pm',
};

const clientsOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Cliente 1' },
  { key: 'B', text: 'Cliente 2' },
  { key: 'C', text: 'Cliente 3' }
];

const channelOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Canal 1' },
  { key: 'B', text: 'Canal 2' },
  { key: 'C', text: 'Canal 3' }
];

const promotionCategoryOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Categoría de promoción 1' },
  { key: 'B', text: 'Categoría de promoción  2' },
  { key: 'C', text: 'Categoría de promoción  3' },
];

const promotionTypesOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Tipo de promoción 1' },
  { key: 'B', text: 'Tipo de promoción 2' },
  { key: 'C', text: 'Tipo de promoción 3' },
];

const brandOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Marca 1' },
  { key: 'B', text: 'Marca 2' },
  { key: 'C', text: 'Marca 3' },
];

const investmentOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Inversión 1' },
  { key: 'B', text: 'Inversión 2' },
  { key: 'C', text: 'Inversión 3' },
];

const categoryOptions: IComboBoxOption[] = [
  { key: 'A', text: 'Categoría 1' },
  { key: 'B', text: 'Categoría 2' },
  { key: 'C', text: 'Categoría 3' },
];

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],

  shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],

  days: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Ir a hoy',
  prevMonthAriaLabel: 'Ir a mes anterior',
  nextMonthAriaLabel: 'Ir a siguiente mes',
  prevYearAriaLabel: 'Ir a año anterior',
  nextYearAriaLabel: 'Ir a siguiente año',
  closeButtonAriaLabel: 'Cerrar selector de fecha',
  monthPickerHeaderAriaLabel: '{0}, seleccione para cambiar el año',
  yearPickerHeaderAriaLabel: '{0}, seleccione para cambiar el mes',
  isRequiredErrorMessage: 'Este campo es requerido',
  invalidInputErrorMessage: 'Formato invalido',
};

const firstDayOfWeek = DayOfWeek.Sunday;

const verticalSeparatorStyle = {
  root:
    [{
      padding: '0px !important',
      marginBottom: '2px',
      selectors: {
        '::after': {
          background: '#707070',
          minHeight: '100%',
          padding: '0px !important'
        }
      }
    }]
};

const confirmationDialogStyles = { main: { maxWidth: '450px' } };

{/* Fin Content */ }

{/* Bottom */ }

{/* Fin Bottom */ }

export class MockupForm extends React.Component<IMockupFormProps, IMockupFormState> {

  constructor(props: IMockupFormProps) {
    super(props);

    this._validationsTriggerClicked = this._validationsTriggerClicked.bind(this);

    this.state = {
      isLoading: true,
      hasValidationError: false,
      enableSubmit: false,
      formSubmitted: false,
      resultIsOK: false,
      selectedIndex: 0,
      loadingTypes: false,
      mainModalOpen: true,
      hideDeleteProductDialog: true,
      errorMessage: "",
      hideModalConfirmationDialog: true,
      effective: true,
      // filteredProducts: []
    };
  }

  public componentDidMount() {

  }

  private deleteProductDialogContentProps = {
    type: DialogType.normal,
    title: 'Eliminar producto',
    closeButtonAriaLabel: 'Cerrar',
    subText: 'Esta seguro que desea eliminar este producto de la promoción?',
  };

  private closeModalDialogContentProps = {
    type: DialogType.normal,
    title: 'Salir sin guardar',
    closeButtonAriaLabel: 'Cerrar',
    subText: 'Esta seguro que desea cerrar el formulario sin guardar?',
  };

  public render(): React.ReactElement<IMockupFormProps> {

    return (
      <div>
        <Modal
          isOpen={this.state.mainModalOpen}
          className="{contentStyles.modal} mainModal">

          {/* Modal Header*/}

          <div className={contentStyles.header}>
            <span>Cliente 1 - Promo descuento</span>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => this.setState({ hideModalConfirmationDialog: false })}
            />
          </div>
          <Dialog
            hidden={this.state.hideModalConfirmationDialog}
            dialogContentProps={this.closeModalDialogContentProps}
            styles={confirmationDialogStyles}
          >
            <DialogFooter>

              <DefaultButton onClick={() => this.setState({ hideModalConfirmationDialog: true })} text="Cancelar" />
              <PrimaryButton onClick={() => this.setState({ mainModalOpen: false })} text="Salir sin guardar" />
            </DialogFooter>
          </Dialog>
          {/* Fin Modal Header*/}

          {/* Modal Content*/}

          <Stack className="mainPdding">
            <Pivot aria-label="Main Pivot" className="mainPivot" overflowBehavior="menu">
              <PivotItem onRenderItemLink={this._customPromotionPivotItemRenderer}>
                <Stack styles={repetitiveSectionStyle}>
                  <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                    <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                    <Stack className="label">Estado:</Stack>
                    <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>Pendiente de aprobación</Stack>
                  </Stack>
                  {/* Promotion section */}
                  <Stack horizontal className="padding">

                    <Stack grow={8} verticalAlign="start">
                      <Stack grow={12} horizontal className="smallPadding">
                        <Stack grow={6} className="padding-right controlPadding">
                          <TextField
                            id="promoName"
                            label="Nombre de la promoción"
                            placeholder="Ingrese el nombre de la promoción"
                            required
                            errorMessage={this.state.errorMessage}
                            value="Promo descuento" />
                        </Stack>
                        <Stack grow={6} className="padding-right controlPadding">
                          <div>
                            <ComboBox
                              label="Cliente"
                              allowFreeform
                              autoComplete="on"
                              options={clientsOptions}
                              placeholder="Seleccione un cliente"
                              required
                              errorMessage={this.state.errorMessage}
                              defaultSelectedKey="A" />
                          </div>
                        </Stack>
                      </Stack >
                      <Stack grow={12} className="padding-right multilineControlPadding">
                        <TextField
                          id="activityObjective"
                          label="Objetivo de la actividad"
                          placeholder="Ingrese el objetivo"
                          required
                          errorMessage={this.state.errorMessage}
                          multiline
                          rows={3}
                          resizable={false} />
                      </Stack>
                    </Stack>

                    <Stack grow={4} horizontal>
                      <Stack verticalFill>
                        <Separator vertical={true} styles={verticalSeparatorStyle}></Separator>
                      </Stack>
                      <Stack grow={12}>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                          <Label className="peopleLabel">Cabeza de canal</Label>
                          <Persona
                            {...examplePersona}
                            size={PersonaSize.size24}
                            presence={PersonaPresence.online}
                            hidePersonaDetails={false}
                            imageAlt="Annie Lindqvist, status is online"
                          />
                        </Stack>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                          <Label className="peopleLabel">Gerente KAM</Label>
                          <Persona
                            {...examplePersona2}
                            size={PersonaSize.size24}
                            presence={PersonaPresence.online}
                            hidePersonaDetails={false}
                            imageAlt="Annie Lindqvist, status is online"
                          />
                        </Stack>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                          <Label className="peopleLabel">Canal</Label>
                          <Label className="labelNotBold">Canal 1</Label>
                        </Stack>
                        <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                          <Label className="peopleLabel">Subcanal</Label>
                          <Label className="labelNotBold">Subcanal 1.1</Label>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Repetitive section */}
                  <Stack>
                    <Pivot className="innerPivot" aria-label="Inner Pivot" overflowBehavior="menu">
                      <PivotItem
                        headerText="MX1.1"
                        headerButtonProps={{
                          'data-order': 1,
                          'data-title': 'MX1.1',
                        }}>
                        <Stack className="deleteProductContainer" horizontal horizontalAlign="end">
                          <Stack className="label">
                            <Link onClick={() => this.setState({ hideDeleteProductDialog: false })}><Icon iconName="MapLayers" /><span style={{ color: '#323130' }}>Borrar producto</span></Link>
                          </Stack>

                          <Dialog
                            hidden={this.state.hideDeleteProductDialog}
                            dialogContentProps={this.deleteProductDialogContentProps}
                            styles={confirmationDialogStyles}
                          >
                            <DialogFooter>
                              <PrimaryButton onClick={() => this.setState({ hideDeleteProductDialog: true })} text="Eliminar" />
                              <DefaultButton onClick={() => this.setState({ hideDeleteProductDialog: true })} text="Cancelar" />
                            </DialogFooter>
                          </Dialog>

                        </Stack>

                        <Stack horizontal styles={repetitiveSectionStyle} className="padding">
                          <Stack grow={8}>
                            <Stack styles={{ root: { maxHeight: "30px" } }} className="smallPadding padding-right" grow={6}>
                              <Stack horizontal className="actividadTopadaContainer smallPadding-left">
                                <Stack>
                                  <Label>Actividad Topada</Label>
                                </Stack>
                                <Stack className="toRight smallPadding actividadTopadaToggle">
                                  <Toggle onText="Si" offText="No" />
                                </Stack>
                              </Stack>
                            </Stack>
                            <Stack horizontal grow={12} styles={{ root: { paddingTop: "16px" } }}>
                              <Stack className="smallPadding" grow={6}>
                                <Stack className="padding-right controlPadding">
                                  <ComboBox
                                    label="Categoría de la promoción"
                                    allowFreeform
                                    autoComplete="on"
                                    options={promotionCategoryOptions}
                                    placeholder="Seleccion la categoría"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <ComboBox
                                    label="Tipo de la promoción"
                                    allowFreeform
                                    autoComplete="on"
                                    options={promotionTypesOptions}
                                    placeholder="Seleccione el tipo"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    id="bu"
                                    placeholder="Ingrese la unidad de negocios"
                                    label="BU"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    id="sku"
                                    placeholder="Ingrese el SKU"
                                    label="SKU"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <DatePicker
                                    label="Fecha de inicio"
                                    firstDayOfWeek={firstDayOfWeek}
                                    strings={DayPickerStrings}
                                    placeholder="Seleccione una fecha..."
                                    ariaLabel="Seleccione una fecha"
                                    isRequired={true}
                                  />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    id="discaoutPerUnit"
                                    placeholder="Ingrese el descuento por pieza"
                                    label="Descuento por pieza"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                              </Stack>
                              <Stack className="smallPadding" grow={6}>
                                <Stack className="padding-right controlPadding">
                                  <ComboBox
                                    label="Inversión"
                                    allowFreeform
                                    autoComplete="on"
                                    options={investmentOptions}
                                    placeholder="Ingrese una inversión"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <TextField
                                    id="shortDescription"
                                    label="Descripción corta"
                                    placeholder="Ingrese una descripción"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <ComboBox
                                    label="Marca"
                                    allowFreeform
                                    autoComplete="on"
                                    options={brandOptions}
                                    placeholder="Ingrese una marca"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <ComboBox
                                    label="Categoría"
                                    allowFreeform
                                    autoComplete="on"
                                    options={categoryOptions}
                                    placeholder="Ingrese una categoría"
                                    required
                                    errorMessage={this.state.errorMessage} />
                                </Stack>
                                <Stack className="padding-right controlPadding">
                                  <DatePicker
                                    label="Fecha de finalización"
                                    firstDayOfWeek={firstDayOfWeek}
                                    strings={DayPickerStrings}
                                    placeholder="Seleccione una fecha..."
                                    ariaLabel="Seleccione una fecha"
                                    isRequired={true}
                                  />
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack grow={4}>
                            <Stack className="smallPadding" grow={4} horizontal>
                              <Separator vertical={true} styles={verticalSeparatorStyle}></Separator>
                              <Stack grow={12}>
                                <Stack horizontal className="grayHeader padding padding-left padding-right">
                                  <Icon iconName="DietPlanNotebook" />
                                  <Label>Detalles de la promoción</Label>
                                </Stack>
                                <Stack className="grayContent smallPadding padding-left padding-right" verticalFill>
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>BEP NR</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>COS</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>GM %NR</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>GM NR con promo</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>GM Base Unit</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>GM Promo Unit</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                  <Stack horizontal className="verticalPadding" verticalFill verticalAlign="center">
                                    <Label>BEP GM</Label>
                                    <Label className="toRight">Valor</Label>
                                  </Stack>
                                  <Separator className="graySeparator separatorToTop" />
                                </Stack>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                        <Stack className="padding-bottom">
                          <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                            <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                              <Icon iconName="DietPlanNotebook" />
                              <Label>Pre análisis</Label>
                            </Stack>
                            <Stack grow={3} horizontalAlign="end">
                              <Label>ROI Estimado por SKU</Label>
                              <Label>1.37</Label>
                            </Stack>
                            <Stack grow={3} horizontalAlign="end">
                              <Label>ROI Estimado Total</Label>
                              <Label>0.92</Label>
                            </Stack>
                            <Stack grow={3} horizontalAlign="end">
                              <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                              <div hidden={!this.state.effective} className="effectiveLabelContainer">
                                <span className="effectiveLabel">EFECTIVA</span>
                              </div>
                              <div hidden={this.state.effective} className="effectiveLabelContainer">
                                <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                              </div>
                            </Stack>
                          </Stack>
                          <Stack horizontal className="grayContent padding padding-left padding-right">
                            <Stack className="smallPadding padding-right controlPadding" grow={4}>
                              <Label htmlFor="estimatedIncrementalVolume">Volumen incremental Estimado</Label>
                              <TextField id="estimatedIncrementalVolume" placeholder="Ingrese el volumen estimado" />
                            </Stack>
                            <Stack className="smallPadding padding-right" grow={4}>
                              <Stack horizontal className="verticalPadding">
                                <Label>Total volumen estimado</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>NR Base</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>NR Incremental base estimado</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>GM promo estimado</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>Inversión estimada</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                            </Stack>
                            <Stack className="smallPadding" grow={4}>
                              <Stack horizontal className="verticalPadding">
                                <Label>% volumen incremental</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>NR estimado</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>GM base</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>GM Incremental</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                              <Stack horizontal className="verticalPadding">
                                <Label>Invesión adicional (MKT)</Label>
                                <Label className="toRight">Valor</Label>
                              </Stack>
                              <Separator className="graySeparator separatorToTop" />
                            </Stack>
                          </Stack>
                        </Stack>
                      </PivotItem>
                      <PivotItem headerText="MX1.2">
                        <Stack styles={repetitiveSectionStyle}>
                          <Label styles={labelStyles}>MX1.2</Label>
                        </Stack>
                      </PivotItem>
                      <PivotItem headerText="Nuevo" itemIcon="Add">
                        <Stack styles={repetitiveSectionStyle}>
                          <Label styles={labelStyles}>Nuevo</Label>
                        </Stack>
                      </PivotItem>
                    </Pivot>
                  </Stack>
                </Stack>
              </PivotItem>
              <PivotItem onRenderItemLink={this._customPromotionSummaryPivotItemRenderer}>
                <Stack className="summarySectionContainer">
                  <Stack styles={repetitiveSectionStyle}>

                    <Stack className="statusContainer smallPadding padding-right" horizontal horizontalAlign="end">
                      <Stack style={{ color: theme.palette.themePrimary, paddingRight: "4px" }}><Icon iconName="MapLayers" /></Stack>
                      <Stack className="label">Estado:</Stack>
                      <Stack style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>Pendiente de aprobación</Stack>
                    </Stack>

                    <Stack horizontal className="padding">

                      <Stack grow={8} verticalAlign="start">
                        <Stack grow={12} className="grayContent padding padding-left padding-right">
                          <Stack horizontal className="verticalPadding">
                            <Label>Cliente</Label>
                            <Label className="toRight">Cliente 1</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />
                          <Stack className="verticalPadding">
                            <Label>Objetivo de la promoción</Label>
                            <span className="twoColumnsContentMaxWidth">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />
                        </Stack>
                      </Stack>

                      <Stack grow={4} horizontal>
                        <Stack verticalFill>
                          <Separator vertical={true} styles={verticalSeparatorStyle}></Separator>
                        </Stack>
                        <Stack grow={12}>
                          <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Cabeza de canal</Label>
                            <Persona
                              {...examplePersona}
                              size={PersonaSize.size24}
                              presence={PersonaPresence.online}
                              hidePersonaDetails={false}
                              imageAlt="Annie Lindqvist, status is online"
                            />
                          </Stack>
                          <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Gerente KAM</Label>
                            <Persona
                              {...examplePersona2}
                              size={PersonaSize.size24}
                              presence={PersonaPresence.online}
                              hidePersonaDetails={false}
                              imageAlt="Annie Lindqvist, status is online"
                            />
                          </Stack>
                          <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Canal</Label>
                            <Label className="labelNotBold">Canal 1</Label>
                          </Stack>
                          <Stack horizontal className="smallPadding padding-left peopleHeaderStyles" verticalFill verticalAlign="center">
                            <Label className="peopleLabel">Subcanal</Label>
                            <Label className="labelNotBold">Subcanal 1.1</Label>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack className="padding-bottom">
                      <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                        <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                          <Icon iconName="DietPlanNotebook" />
                          <Label>Pre análisis MX1.1</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label>ROI Estimado por SKU</Label>
                          <Label>1.37</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label>ROI Estimado Total</Label>
                          <Label>0.92</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                          <div hidden={!this.state.effective} className="effectiveLabelContainer">
                            <span className="effectiveLabel">EFECTIVA</span>
                          </div>
                          <div hidden={this.state.effective} className="effectiveLabelContainer">
                            <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                          </div>
                        </Stack>
                      </Stack>
                      <Stack horizontal className="grayContent padding padding-left padding-right">

                        <Stack className="smallPadding padding-right controlPadding" grow={4}>
                          <Stack horizontal className="verticalPadding">
                            <Label>Total volumen estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM Promo Estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>Inversión adicional (MKT)</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>

                        <Stack className="smallPadding padding-right" grow={4}>

                          <Stack horizontal className="verticalPadding">
                            <Label>% Volumen incremental</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Incremental base estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM incremental</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>
                        <Stack className="smallPadding" grow={4}>

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Base</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM Base</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>Inversión estimada</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack className="padding-bottom">
                      <Stack horizontal className="grayHeader smallPadding padding-left padding-right">
                        <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                          <Icon iconName="DietPlanNotebook" />
                          <Label>Pre análisis MX1.2</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label>ROI Estimado por SKU</Label>
                          <Label>1.37</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label>ROI Estimado Total</Label>
                          <Label>0.92</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                          <div hidden={!this.state.effective} className="effectiveLabelContainer">
                            <span className="effectiveLabel">EFECTIVA</span>
                          </div>
                          <div hidden={this.state.effective} className="effectiveLabelContainer">
                            <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                          </div>
                        </Stack>
                      </Stack>
                      <Stack horizontal className="grayContent padding padding-left padding-right">

                        <Stack className="smallPadding padding-right controlPadding" grow={4}>
                          <Stack horizontal className="verticalPadding">
                            <Label>Total volumen estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM Promo Estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>Inversión adicional (MKT)</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>

                        <Stack className="smallPadding padding-right" grow={4}>

                          <Stack horizontal className="verticalPadding">
                            <Label>% Volumen incremental</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Incremental base estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM incremental</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>
                        <Stack className="smallPadding" grow={4}>

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Base</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM Base</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>Inversión estimada</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack className="padding-bottom">
                      <Stack  horizontal className={this.state.effective 
                        ? "grayHeader smallPadding padding-left padding-right grayHeaderToGreen" 
                        : "grayHeader smallPadding padding-left padding-right grayHeaderToRed"}>
                        <Stack grow={3} horizontal className="verticalPadding preAnalisisPadding">
                          <Icon iconName="DietPlanNotebook" />
                          <Label>Análisis general</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label>ROI Estimado por SKU</Label>
                          <Label>1.37</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label>ROI Estimado Total</Label>
                          <Label>0.92</Label>
                        </Stack>
                        <Stack grow={3} horizontalAlign="end">
                          <Label onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                          <div hidden={!this.state.effective} className="effectiveLabelContainer">
                            <span className="effectiveLabel">EFECTIVA</span>
                          </div>
                          <div hidden={this.state.effective} className="effectiveLabelContainer">
                            <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                          </div>
                        </Stack>
                      </Stack>
                      <Stack horizontal className="grayContent padding padding-left padding-right">

                        <Stack className="smallPadding padding-right controlPadding" grow={4}>
                          <Stack horizontal className="verticalPadding">
                            <Label>Total volumen estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>

                        <Stack className="smallPadding padding-right" grow={4}>

                          <Stack horizontal className="verticalPadding">
                            <Label>% Volumen incremental</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Incremental base estimado</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>
                        <Stack className="smallPadding" grow={4}>

                          <Stack horizontal className="verticalPadding">
                            <Label>NR Base</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                          <Stack horizontal className="verticalPadding">
                            <Label>GM Base</Label>
                            <Label className="toRight">Valor</Label>
                          </Stack>
                          <Separator className="graySeparator separatorToTop" />

                        </Stack>
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
            <Label>Estado general de la promoción</Label>
            <Separator className="graySeparator separatorToTop" />
            <Stack className="modalBottomContent" horizontal grow={12}>
              <Stack grow={3}>
                <Label className="modalBottomContentHeader" onClick={() => this.setState({ effective: !this.state.effective })}>Efectividad</Label>
                <div hidden={!this.state.effective} className="effectiveLabelContainer">
                  <span className="effectiveLabel">EFECTIVA</span>
                </div>
                <div hidden={this.state.effective} className="effectiveLabelContainer">
                  <span className="effectiveLabel notEffectiveLabel">NO EFECTIVA</span>
                </div>
              </Stack>
              <Stack grow={3}>
                <Label className="modalBottomContentHeader">ROI Estimado por SKU</Label>
                <Label className="modalBottomContentValue">1.37</Label>
              </Stack>
              <Stack grow={3}>
                <Label className="modalBottomContentHeader">ROI Estimado total</Label>
                <Label className="modalBottomContentValue">0.92</Label>
              </Stack>
              <Stack className="modalBottomButtonsContainer" grow={3} horizontal horizontalAlign="end">
                <Stack>
                  <DefaultButton text="Guardar borrador" allowDisabledFocus onClick={() => this.setState({ mainModalOpen: false })} />
                </Stack>
                <Stack>
                  <PrimaryButton text="Enviar a aprobación" allowDisabledFocus onClick={this._validationsTriggerClicked} />
                </Stack>
              </Stack>
            </Stack>
          </div>

          {/* Fin Modal Bottom*/}

        </Modal>
      </div>
    );
  }

  private _validationsTriggerClicked() {
    if (this.state.errorMessage == "")
      this.setState({ errorMessage: "Este campo es requerido" });
    else
      this.setState({ errorMessage: "" });
  }

  private _customPromotionPivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="DietPlanNotebook" /></Label>
        <Label>ID Promoción&nbsp;:&nbsp;</Label>
        <Label style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>MX1</Label>
      </Stack>
    );
  }

  private _customPromotionSummaryPivotItemRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <Stack horizontal>
        {defaultRenderer(link)}
        <Label style={{ color: theme.palette.themePrimary }}><Icon iconName="DietPlanNotebook" /></Label>
        <Label>Resumen General</Label>
      </Stack>
    );
  }
}