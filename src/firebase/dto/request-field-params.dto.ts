export interface FieldParams {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}
