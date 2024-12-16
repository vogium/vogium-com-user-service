//todo property params olarakta adlandırılabilir. hangisi uygun bulunursa. attribute, field, property, params...
export interface FieldParams {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}
