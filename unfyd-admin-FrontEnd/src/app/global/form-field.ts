export class FormField<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  validator: string;
  order: number;
  controlType: string;
  type: string;
  icon: string;
  options: { key: string; value: string }[];

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      validator?: string;
      order?: number;
      controlType?: string;
      type?: string;
      icon?: string;
      options?: { key: string; value: string }[];
      dynamicoptions?: string;
      reqparam?: string;
      reqtype?: string;
      validation?: string;
      class?: string;
      inlinedesign?: string;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || "";
    this.label = options.label || "";
    this.required = !!options.required;
    this.validator = options.validator || "";
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || "";
    this.type = options.type || "";
    this.icon = options.icon || "";
    this.options = options.options || [];
  }
}
