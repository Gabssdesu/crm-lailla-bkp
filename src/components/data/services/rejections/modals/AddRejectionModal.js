import { React, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";

export default function LostSaleModal({
	visible,
	rejection,
	setRejection,
	setLostSaleModal,
	isEditing,
	reasons,
	services,
	setRejections,
	saveRejections,
	createId,
	rejections = {},
	emptyLostSale,
}) {

	const handleChange = (e) => {
		const { name, value } = e.target;

		setRejection((prevState) => {
			let newState = { ...prevState, [name]: value };

			if (name === "reason" && value !== "servico-indisponivel") {
				newState.service = "";
			}

			return newState;
		});
	};

	const closeLostSaleModal = () => {
		setRejection(emptyLostSale);
		setLostSaleModal(false);
	};

	const toast = useRef(null);
	const handleSaveLostSale = () => {
		const required_fields = ["reason"];
		if (["value"].includes(rejection?.reason)) {
			required_fields.push("service");
		}
		const not_filled_fields = required_fields.filter(
			(campo) => !rejection[campo]
		);

		if (not_filled_fields.length > 0) {
			toast.current.show({
				severity: "error",
				summary: "Erro",
				detail: "Todos os campos são obrigatórios!",
				life: 3000,
			});
			return;
		}

		if (isEditing) {
			const index = rejections.findIndex(
				(v) => v.rejection_id === rejection.rejection_id
			);
			if (index > -1) {
				const updatedLostSales = [...rejections];
				updatedLostSales[index] = rejection;
				setRejections(updatedLostSales);
				saveRejections(updatedLostSales);
			}
			toast.current.show({
				severity: "success",
				summary: "Sucesso",
				detail: "Objeção editada com sucesso!",
				life: 3000,
			});
		} else {
			const newLostSale = { ...rejection, id: createId() };
			const updatedLostSales = [newLostSale, ...rejections];
			setRejections(updatedLostSales);
			saveRejections(updatedLostSales);

			toast.current.show({
				severity: "success",
				summary: "Sucesso",
				detail: "Objeção salva com sucesso!",
				life: 3000,
			});
		}

		closeLostSaleModal();
	};

	const dropdownOptions = [...reasons.map(({ id, name }) => ({
		label: name,
		value: id,
	}))];
	
	if (rejection?.reason === "Excesso de Follow-Up") {
		dropdownOptions.push({
			label: "Excesso de Follow-Up",
			value: "Excesso de Follow-Up",
			disabled: true,
		});
	}	

	return (
		<>
			<Toast ref={toast} />
			<Dialog
				visible={visible}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header={
					isEditing ? "Edição de Objeção" : "Cadastro de Objeção"
				}
				modal
				draggable={false}
				className="p-fluid"
				footer={
					<>
						<Button
							style={{ margin: "5px", borderRadius: "8px" }}
							label="Cancelar"
							icon="pi pi-times"
							outlined
							onClick={closeLostSaleModal}
						/>
						<Button
							style={{ margin: "5px", borderRadius: "8px" }}
							label="Salvar"
							icon="pi pi-check"
							onClick={handleSaveLostSale}
						/>
					</>
				}
				onHide={closeLostSaleModal}
			>
				<div className="p-fluid">
					<div className="p-field">
						<label htmlFor="reason">Motivo *</label>
						<Dropdown
							id="reason"
							value={rejection?.reason || ""}
							options={dropdownOptions}
							onChange={(e) =>
								handleChange({ target: { name: "reason", value: e.value } })
							}
							style={{ margin: "10px 0" }}
							name="reason"
							placeholder="Escolha um motivo"
							disabled={rejection?.reason === "Excesso de Follow-Up"}
						/>
					</div>

					{rejection?.reason === "value" && (
						<div className="p-field">
							<label htmlFor="service">Serviço *</label>
							<Dropdown
								id="service"
								value={rejection?.service || ""}
								options={Object.entries(services).map(([key, value]) => ({
									label: value,
									value: key,
								}))}
								onChange={(e) =>
									handleChange({
										target: { name: "service", value: e.value },
									})
								}
								style={{ margin: "10px 0" }}
								name="service"
								placeholder="Escolha um serviço"
							/>
						</div>
					)}

					<div className="p-field">
						<label htmlFor="detail">Observação</label>
						<InputTextarea
							id="detail"
							value={rejection?.detail || ""}
							onChange={handleChange}
							style={{ margin: "10px 0" }}
							name="detail"
							placeholder="Escreva observações adicionais"
							autoResize
							rows={2}
							cols={50}
							disabled={rejection?.reason === "Excesso de Follow-Up"}
						/>
					</div>
				</div>
			</Dialog>
		</>
	);
}