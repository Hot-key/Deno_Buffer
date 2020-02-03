import BitConverter, { StringType } from "./BitConverter.ts";

export default class HotkeyBuffer{

    private buffer: Uint8Array = new Uint8Array(0);

    private size: number = 0;
    private offset: number = 0;
    private count: number = 0;

    public get Buffer(): Uint8Array {
        return this.buffer
    }
    public set Buffer(v: Uint8Array) {
        this.buffer = v;
    }
    
    public get Offset(): number {
        return this.offset
    }
    public set Offset(v: number) {
        this.offset = v;
    }

    public get Count(): number {
        return this.count
    }
    public set Count(v: number) {
        this.count = v;
    }
    
    public get capacity(): number {
        return this.buffer.byteLength;
    }
  
    public constructor(pBuffer: Uint8Array, pOffset: number, pCount: number);
    public constructor(pSize: number);
    public constructor(pSizeOrBuffer: Uint8Array | number, pOffset?: number, pCount?: number){
      if(pSizeOrBuffer instanceof  Uint8Array) // constructor(pBuffer : Uint8Array, pOffset : number, pCount : number);
      {
        this.buffer = pSizeOrBuffer;
        this.offset = pOffset;
        this.count = pCount;
      }
      else // constructor(pSize : number);
      {
        this.buffer = new Uint8Array(pSizeOrBuffer);
        this.offset = 0;
        this.count = 0;
      }
    }

    public Clone(): HotkeyBuffer
    {
        let tempBuffer: Uint8Array = new Uint8Array(this.buffer);
        return new HotkeyBuffer(tempBuffer, this.offset, this.count);
    }

    public Clear(): Uint8Array{
        let tempBuffer: Uint8Array = new Uint8Array(this.buffer);

        this.buffer = null;
        this.offset = 0;
        this.count = 0;

        return tempBuffer;
    }

    public Empty(): boolean{
        return this.buffer == null;
    }

    public append_UInt8(arg: number){
        this.buffer[this.offset + this.count] = arg;
        this.count++;
    }
    public append_UInt16(arg: number){
        let tempArray: Uint8Array = BitConverter.UInt16ToBytes(arg);
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+=2;
    }
    public append_UInt32(arg: number){
        let tempArray: Uint8Array = BitConverter.UInt32ToBytes(arg);
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+=4;
    }
    public append_UInt64(arg: number){
        let tempArray: Uint8Array = BitConverter.UInt64ToBytes(arg);
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+=8;
    }
    
    public append_Int8(arg: number){
        this.buffer[this.offset + this.count] = arg;
        this.count++;
    }
    public append_Int16(arg: number){
        let tempArray: Uint8Array = BitConverter.Int16ToBytes(arg);
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+=2;
    }
    public append_Int32(arg: number){
        let tempArray: Uint8Array = BitConverter.Int32ToBytes(arg);
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+=4;
    }
    public append_Int64(arg: number){
        let tempArray: Uint8Array = BitConverter.Int64ToBytes(arg);
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+=8;
    }

    public append_String(arg: string, type: StringType = StringType.Utf16){
        let tempArray: Uint8Array = BitConverter.StringToBytes(arg, type, true);
        let tempCount = 0;
        if(type == StringType.Utf8)
        {
            tempCount = tempArray.length; // \0 이 포함된 길이
        }
        else
        {
            tempCount = arg.length + 1; // \0 을 더함
        }
        this.append_UInt16(tempCount); 
        this.buffer.set(tempArray, this.offset + this.count)
        
        this.count+= (BitConverter.CharSize(type) * tempCount);
    }
    public append_Text(arg: string, type: StringType = StringType.Utf16){
        let tempArray: Uint8Array = BitConverter.StringToBytes(arg, type, true);
        
        this.buffer.set(tempArray, this.offset + this.count)

        this.count+= (BitConverter.CharSize(type) * (arg.length + 1));
    }

    public extract_UInt8(): number{
        let tempData: number =  BitConverter.BytesToUInt8(this.buffer, this.offset)
        this.offset++;
        return tempData;
    }
    public extract_UInt16(): number{
        let tempData: number =  BitConverter.BytesToUInt16(this.buffer, this.offset)
        this.offset+= 2;
        return tempData;
    }
    public extract_UInt32(): number{
        let tempData: number =  BitConverter.BytesToUInt32(this.buffer, this.offset)
        this.offset+= 4;
        return tempData;
    }
    public extract_UInt64(): number{
        let tempData: number =  BitConverter.BytesToUInt64(this.buffer, this.offset)
        this.offset+= 8;
        return tempData;
    }

    public extract_Int8(): number{
        let tempData: number =  BitConverter.BytesToInt8(this.buffer, this.offset)
        this.offset++;
        return tempData;
    }
    public extract_Int16(): number{
        let tempData: number =  BitConverter.BytesToInt16(this.buffer, this.offset)
        this.offset+= 2;
        return tempData;
    }
    public extract_Int32(): number{
        let tempData: number =  BitConverter.BytesToInt32(this.buffer, this.offset)
        this.offset+= 4;
        return tempData;
    }
    public extract_Int64(): number{
        let tempData: number =  BitConverter.BytesToInt64(this.buffer, this.offset)
        this.offset+= 8;
        return tempData;
    }

    public extract_String(type: StringType | string= StringType.Utf16): string{
        let tempData: string = "";
        let stringCount = (BitConverter.CharSize(type) * this.extract_Int16()) - BitConverter.CharSize(type);

        tempData = BitConverter.BytesToString(this.buffer.subarray(this.offset,this.offset + stringCount), type);
        this.offset+= stringCount;

        return tempData;
    }
    public extract_Text(type: StringType | string = StringType.Utf16): string{
        let tempData: string = "";
        let charSize: number = BitConverter.CharSize(type);
        let subarray: Uint8Array = this.buffer.subarray(this.offset);
        let nullPos: number = 0;

        for (let i = 0; i < subarray.length / charSize; i += charSize) { // offset다음에서 가장 가까운 \0 을 찾음
            let isNull = true;
            for (let j = 0; j < charSize; j++) {
                isNull = isNull && subarray[i + j] == 0
            }
            if(isNull){
                nullPos = i
                break;
            }
        }

        tempData = BitConverter.BytesToString(this.buffer.subarray(this.offset,this.offset + nullPos), type);

        this.offset += nullPos;

        return tempData;
    }
}