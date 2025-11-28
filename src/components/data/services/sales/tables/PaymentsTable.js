import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { formatBRLCurrency } from "@/functions/formatters";

export default function PaymentsTable({
	sale,
	payments,
	isAdmin = false,
	onDeletePayment,
}) {

	const paymentAmountBodyTemplate = (rowData) => {
		return formatBRLCurrency(Number(rowData.amount || 0));
	};

	const paymentDateBodyTemplate = (rowData) => {
		return rowData.date
			? new Date(rowData.date).toLocaleDateString("pt-BR")
			: "N/A";
	};

	const paymentMethodBodyTemplate = (rowData) => {
		return rowData.method || "N/A";
	};

	const isSignBodyTemplate = (rowData) => {
		return rowData.is_sign ? (
			<i
				className="pi pi-check-circle"
				tooltip="Sinal"
				tooltipOptions={{
					position: "top",
					mouseTrack: true,
					mouseTrackTop: 15,
				}}
				style={{ color: "green", fontSize: "1.2rem", textAlign: "center" }}
				title="Pagamento de sinal"
			></i>
		) : (
			<i
				// className="pi pi-times-circle"
				style={{ color: "red", fontSize: "1.2rem", textAlign: "center" }}
				title="Não é pagamento de sinal"
			></i>
		);
	};

	const deletePaymentBodyTemplate = (rowData) => {
		return (
			<Button
				icon="pi pi-trash"
				severity="danger"
				text
				tooltip="Excluir pagamento"
				tooltipOptions={{
					position: "top",
					mouseTrack: true,
					mouseTrackTop: 15,
				}}
				onClick={() => onDeletePayment(rowData)}
			/>
		);
	};

	return (
		<DataTable
			value={sale?.payments}
			stripedRows
			className="payment-table"
			style={{ overflowX: "hidden" }}
			// paginator
			// rows={5}
			// paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport"
			// currentPageReportTemplate="Exibindo de {first} a {last} de {totalRecords} pagamentos"
		>
			<Column
				body={(rowData) => paymentAmountBodyTemplate(rowData)}
				field="amount"
				header="Valor"
				style={{ width: "18%" }}
			/>
			<Column
				body={(rowData) => paymentDateBodyTemplate(rowData)}
				field="created_at"
				header="Data"
				style={{ width: "15%" }}
			/>
			<Column
				body={(rowData) => paymentMethodBodyTemplate(rowData)}
				field="method"
				header="Método"
				style={{ width: "20%" }}
			/>
			<Column
				body={(rowData) => isSignBodyTemplate(rowData)}
				field="sign"
				header="Sinal"
				style={{ width: "5%" }}
			/>
			{isAdmin && (
				<Column
					body={(rowData) => deletePaymentBodyTemplate(rowData)}
					exportable={false}
					style={{ width: "2%" }}
				/>
			)}
		</DataTable>
	);
}