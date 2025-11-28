import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { locale, addLocale } from "primereact/api";

locale("pt");
addLocale("pt", {
	firstDayOfWeek: 1,
	dayNames: [
		"domingo",
		"segunda",
		"terça",
		"quarta",
		"quinta",
		"sexta",
		"sábado",
	],
	dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
	dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
	monthNames: [
		"janeiro",
		"fevereiro",
		"março",
		"abril",
		"maio",
		"junho",
		"julho",
		"agosto",
		"setembro",
		"outubro",
		"novembro",
		"dezembro",
	],
	monthNamesShort: [
		"jan",
		"fev",
		"mar",
		"abr",
		"mai",
		"jun",
		"jul",
		"ago",
		"set",
		"out",
		"nov",
		"dez",
	],
	today: "Hoje",
	clear: "Limpar",
	emptyFilterMessage: "Nada foi encontrado...",
	emptyMessage: "Nada foi encontrado...",
});

export default function LostSalesTable({
	rejections,
	setRejections,
	globalFilter,
	setGlobalFilter,
	reasons,
	isAdmin,
	setRejection,
	setDeleteLostSaleModal,
	setIsEditing,
	setLostSaleModal,
	emptyLostSale,
	setLostSaleDetailsModal
}) {

	const openLostSaleDetailsModal = (rowData) => {
		setRejection(rowData);
		setLostSaleDetailsModal(true);
	};

	const openLostSaleModal = (saleToEdit = null) => {
		if (saleToEdit) {
			setRejection(saleToEdit);
			setIsEditing(true);
		} else {
			setRejection(emptyLostSale);
			setIsEditing(false);
		}
		setLostSaleModal(true);
	};

	const confirmarDeletarVendaPerdida = (venda) => {
		setRejection(venda);
		setDeleteLostSaleModal(true);
	};

	const onRowEditComplete = (e) => {
		let _lostSales = [...rejections];
		let { newData, index } = e;

		_lostSales[index] = {
			..._lostSales[index],
			...newData,
		};

		setRejections(_lostSales);
	};

	const deleteLostSaleBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-trash"
					severity="danger"
					text
					onClick={() => confirmarDeletarVendaPerdida(rowData)}
				/>
			</React.Fragment>
		);
	};

	const reasonBodyTemplate = (rowData) => {
		const reason = reasons.find((r) => r.id === rowData.reason);
		if (reason) return reason.name;
	
		if (rowData.reason === "Excesso de Follow-Up") return "Excesso de Follow-Up";
	
		return "Motivo desconhecido";
	};

	const editLostSaleBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-pencil"
					text
					onClick={() => openLostSaleModal(rowData)}
				/>
			</React.Fragment>
		);
	};

	const dateBodyTemplate = (rowData) => {
		if (!rowData.date) return "Data não disponível";

		const [datePart, timePart] = rowData.date.split("T");
		const [year, month, day] = datePart.split("-");
		const [hour, minute] = timePart.split(":");

		return `${day}/${month}/${year} às ${hour}:${minute}`;
	};

	const lostSaleDetailsBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-external-link"
					text
					onClick={() => openLostSaleDetailsModal(rowData)}
				/>
			</React.Fragment>
		);
	};

	const header = (
		<div
			style={{ display: "flex", height: "35px" }}
			className="gap-2 align-items-center justify-content-between"
		>
			<div className="flex flex-wrap gap-2">
				<Button
					style={{ height: "50px", borderRadius: "8px" }}
					label="Novo"
					iconPos="right"
					icon="pi pi-plus"
					severity="success"
					onClick={() => openLostSaleModal()}
				/>
			</div>

			<IconField iconPosition="right" style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
				<InputText
					type="search"
					onInput={(e) => setGlobalFilter(e.target.value)}
					placeholder="Pesquisar"
				/>
				<InputIcon className={classNames("pi pi-search")} />
			</IconField>
		</div>
	);

	return (
		<DataTable
			value={Array.isArray(rejections) ? rejections : []}
			editMode="row"
			onRowEditComplete={onRowEditComplete}
			dataKey="rejection_id"
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25]}
			paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
			currentPageReportTemplate="Exibindo de {first} a {last} de {totalRecords} vendas"
			globalFilter={globalFilter}
			header={header}
		>
			<Column
				field="reason"
				header="Motivo"
				body={reasonBodyTemplate}
				style={{ width: "16%" }}
			/>
			<Column
				field="date"
				header="Data"
				body={dateBodyTemplate}
				style={{ width: "16%" }}
			/>
			<Column
				field="editarVenda"
				body={(rowData) => editLostSaleBodyTemplate(rowData)}
				exportable={false}
				style={{ width: "5%" }}
				bodyStyle={{ textAlign: "center" }}
			/>
			<Column
				body={(rowData) => lostSaleDetailsBodyTemplate(rowData)}
				exportable={false}
				style={{ width: "5%" }}
				bodyStyle={{ textAlign: "center" }}
			/>
			{isAdmin && (
				<Column
					body={deleteLostSaleBodyTemplate}
					exportable={false}
					style={{ width: "4%" }}
				/>
			)}
		</DataTable>
	);
}