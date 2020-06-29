import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";


export function ReimbursementDTOtoReimbursementConverter(rdto: ReimbursementDTO): Reimbursement{
    return {
        reimbursementId: rdto.reimbursement_id,
        author: rdto.author,
        amount: rdto.amount,
        dateSubmitted: rdto.dateSubmitted.getFullYear(),
        dateResolved: rdto.dateResolved.getFullYear(),
        description: rdto.description,
        resolver: rdto.resolver,
        status: rdto.status,
        type: rdto.type
    }

}