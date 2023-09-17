export interface TreeData {
  Id: number;
  Name: string;
  Description: string;
  Children: TreeData[];
  KeyNum: string;
  MessageName: string;

}

export interface DialogData {
  Name: string;
  Description: string;
  Component: string;
  KeyNum: number;
  MessageName: string;
}
