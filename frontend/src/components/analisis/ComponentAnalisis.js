//#region Importaciones
import React, { Component } from "react";
import { Button, Grid, Icon, Label, Table, Checkbox } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";
//#endregion

//#region CSS
import "../global/css/Gestionar.css";
//#endregion

//#region Componentes
import ComponentAddAnalisis from "./ComponentAddAnalisis";
//#endregion

//#region Defincion de la clase
class ComponentAnalisis extends Component {
	//#region Constructor
	constructor(props) {
		super(props);

		this.DeleteAnalisis = this.DeleteAnalisis.bind(this);
	}
	//#endregion

	//#region Metodos y Eventos
	shouldComponentUpdate() {
		const data = this.props.global.cookies();
		if (!data) {
			this.props.Deslogin();
			return false;
		}
		return true;
	}
	DeleteAnalisis = (analisis) => {
		//chequear que las cookies tengan los datos necesarios
		const data = this.props.global.cookies();
		if (!data) this.props.Deslogin();
		else {
			//Esta seguro?
			let { text, accion } = "";
			if (analisis.activo) accion = "Desactivar";
			else accion = "Eliminar";
			text = "Desea " + accion + " el analisis";

			Swal.fire({
				title: "¿Esta seguro?",
				text: text,
				icon: "question",
				showCancelButton: true,
				cancelButtonColor: "#db2828",
				confirmButtonColor: "#21ba45",
				confirmButtonText: "Si, " + accion,
				reverseButtons: true,
			}).then((result) => {
				//si escogio Si
				if (result.value) {
					//enviar al endpoint
					fetch(this.props.global.endpoint + "api/analisis/" + analisis._id, {
						method: "PUT",
						body: JSON.stringify(analisis),
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							"access-token": data.token,
						},
					})
						.then((res) => res.json())
						.then((serverdata) => {
							const { status, message } = serverdata;
							//chequear el mensaje
							status === 200
								? Swal.fire({
										position: "center",
										icon: "success",
										title: message,
										showConfirmButton: false,
										timer: 3000,
								  })
								: Swal.fire({
										position: "center",
										icon: "error",
										title: message,
										showConfirmButton: false,
										timer: 5000,
								  });
							//recargar
							this.props.GetDataFromServer();
						})
						.catch((err) => {
							Swal.fire({
								position: "center",
								icon: "error",
								title: err,
								showConfirmButton: false,
								timer: 5000,
							});
						});
				}
			});
		}
	};
	CheckAndAllowAddButton = (middleButtonAdd, allow) => {
		if (allow) return <ComponentAddAnalisis Deslogin={this.props.Deslogin} middleButtonAdd={middleButtonAdd} global={this.props.global} examenes={this.props.examenes} examen={this.props.examen} GetDataFromServer={this.props.GetDataFromServer} />;
		else
			return (
				<Button floated="right" icon labelPosition="left" primary size="small" className="modal-button-add" disabled>
					<Icon name="add circle" />
					Adicionar
				</Button>
			);
	};
	DetailsOfTests = (analisis) => {
		const examen = analisis.examen;
		if (examen.tipo === "Embarazo") {
			const embarazo = examen.embarazo;
			if (embarazo.tipo === "Nuevo") {
				const { semanas, dias } = JSON.parse(examen.tiempoDeGestacion);
				return (
					<Label.Group className="button-pregnancy-separate">
						Tiempo de Gestación:{" "}
						<Button as="div" labelPosition="right" className="button-pregnancy">
							<Button icon>
								<Icon name="calendar alternate outline" />
								Semanas:
							</Button>
							<Label basic pointing="left">
								{semanas}
							</Label>
						</Button>
						<Button as="div" labelPosition="right" className="button-pregnancy">
							<Button icon>
								<Icon name="calendar alternate" />
								Dias:
							</Button>
							<Label basic pointing="left">
								{dias}
							</Label>
						</Button>
					</Label.Group>
				);
			} else {
				return (
					<Label.Group className="button-pregnancy-separate">
						<Button as="div" labelPosition="right" className="button-pregnancy">
							<Button icon>
								<Icon name="heartbeat" />
								Fin de Embarazo:
							</Button>
							<Label basic pointing="left">
								{embarazo.findeembarazo}
							</Label>
						</Button>
						<Button as="div" labelPosition="right" className="button-pregnancy">
							<Button icon>
								<Icon name={embarazo.findeembarazo === "Parto" ? "birthday cake" : "user md"} />
								{embarazo.findeembarazo === "Parto" ? "Modo de Parto: " : "Modo de Aborto: "}
							</Button>
							<Label basic pointing="left">
								{embarazo.findeembarazo === "Parto" ? embarazo.findeparto : embarazo.findeaborto}
							</Label>
						</Button>
					</Label.Group>
				);
			}
		} else {
			return "Sin Detalles";
		}
	};
	//#endregion

	//#region Render
	render() {
		const data = this.props.global.cookies();
		//buscar el permiso del rol
		const permiso = this.props.global.permisos.find((p) => p.rol === data.rol);
		//buscar el acceso del menu
		const accesomenu = permiso.accesos.find((p) => p.opcion === "analisis");
		const classNameTable = this.props.detail ? "div-table-detail" : "div-table";
		//chequear si es analisis y tengo permiso
		return (
			<Grid textAlign="center" verticalAlign="top" className="gestionar-allgrid">
				<Grid.Column className="gestionar-allcolumn">
					{!this.props.detail ? (
						<Label attached="top left" className="div-label-attached" size="large">
							<Icon name="syringe" size="large" inverted /> Gestión de Analisis
						</Label>
					) : (
						""
					)}
					{this.props.analisis.length > 0 ? (
						<Table compact celled definition attached="top" className={classNameTable}>
							<Table.Header className="div-table-header">
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell colSpan="6">{this.CheckAndAllowAddButton(false, accesomenu.permisos.crear)}</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Fecha Planificada</Table.HeaderCell>
									<Table.HeaderCell>Examen</Table.HeaderCell>
									<Table.HeaderCell>Detalles</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Pendiente</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Activo</Table.HeaderCell>
									<Table.HeaderCell className="cells-max-witdh-2">Acciones</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{this.props.analisis.map((one) => {
									let negative = !one.activo;
									let fechacadena = moment(new Date(one.fecha)).format("DD-MM-YYYY");
									return (
										<Table.Row key={one._id} negative={negative}>
											<Table.Cell collapsing>
												<Icon name="syringe" />
											</Table.Cell>
											<Table.Cell>{fechacadena}</Table.Cell>
											<Table.Cell>{this.DetailsOfTests(one)}</Table.Cell>
											<Table.Cell>{one.tipo}</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="pendiente" labelPosition="left" label={one.pendiente ? "Si" : "No"} checked={one.pendiente} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												<Checkbox toggle name="activo" labelPosition="left" label={one.activo ? "Si" : "No"} checked={one.activo} disabled />
											</Table.Cell>
											<Table.Cell className="cells-max-witdh-2" collapsing>
												{accesomenu.permisos.eliminar ? <Button icon="remove circle" className="button-remove" onClick={() => this.DeleteAnalisis(one)} /> : <Button icon="remove circle" className="button-remove" disabled />}
												{accesomenu.permisos.modificar ? (
													// <ComponentUpdatePregnancy
													//   Deslogin={this.props.Deslogin}
													//   GetDataFromServer={this.props.GetDataFromServer}
													//   global={this.props.global}
													//   pacientes={this.props.pacientes}
													//   pregnancy={embarazo}
													// />
													""
												) : (
													<Button icon="edit" disabled />
												)}
											</Table.Cell>
										</Table.Row>
									);
								})}
							</Table.Body>
						</Table>
					) : (
						this.CheckAndAllowAddButton(this.props.middleButtonAdd, accesomenu.permisos.crear)
					)}
				</Grid.Column>
			</Grid>
		);
	}
	//#endregion
}
//#endregion

//#region Export
export default ComponentAnalisis;
//#endregion