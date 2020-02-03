export default class BitConverter{
    public static IsLittleEndian = false;
    
    public static UInt8ToBytes(data: number): Uint8Array{
        return new Uint8Array([data]);
    }
    public static UInt16ToBytes(data: number): Uint8Array{
        return new Uint8Array([(data<<16),(data<<24)].map(z=> z>>>24));
    }
    public static UInt32ToBytes(data: number): Uint8Array{
        return new Uint8Array([data,(data<<8),(data<<16),(data<<24)].map(z=> z>>>24));
    }
    public static UInt64ToBytes(data: number): Uint8Array{
        var y = Math.floor(data/2**32);
        return new Uint8Array([y,(y<<8),(y<<16),(y<<24), data,(data<<8),(data<<16),(data<<24)].map(z=> z>>>24));
    }

    public static Int8ToBytes(data: number): Uint8Array{
        return BitConverter.UInt8ToBytes(data)
    }
    public static Int16ToBytes(data: number): Uint8Array{
        return BitConverter.UInt16ToBytes(data)
    }
    public static Int32ToBytes(data: number): Uint8Array{
        return BitConverter.UInt32ToBytes(data)
    }
    public static Int64ToBytes(data: number): Uint8Array{
        return BitConverter.UInt64ToBytes(data)
    }

    public static BytesToInt8(byteArr: Uint8Array, offSet: number = 0): number{
        if(byteArr[offSet] & 128){
            return byteArr[offSet] - 256;
        }
        return byteArr[offSet];
    }
    public static BytesToInt16(byteArr: Uint8Array, offSet: number = 0): number{
        let complement: number = 0;
        let startNum: number = 0;

        if(byteArr[0] & 128){
            complement = 255;
            startNum = -1;
        }

        if(BitConverter.IsLittleEndian)
            return (byteArr[offSet + 0] - complement) | ((byteArr[offSet + 1] - complement) << 8) + startNum;
        else
            return ((byteArr[offSet + 0]- complement) << 8) | ((byteArr[offSet + 1] - complement)) + startNum;
    }
    public static BytesToInt32(byteArr: Uint8Array, offSet: number = 0): number{
        if(BitConverter.IsLittleEndian)
            return (byteArr[offSet + 0]) | (byteArr[offSet + 1] << 8) | (byteArr[offSet + 2] << 16) | (byteArr[offSet + 3] << 24);
        else
            return (byteArr[offSet + 0] << 24) | (byteArr[offSet + 1] << 16) | (byteArr[offSet + 2] << 8) | (byteArr[offSet + 3]);
    }
    public static BytesToInt64(byteArr: Uint8Array, offSet: number = 0): number{
        let tempData: number = undefined;
        let complement: number = 0;
        let startNum: number = 0;
        if(byteArr[0] & 128){ //isNegative
            complement = 255;
            startNum = -1;
        }

        if(BitConverter.IsLittleEndian){
            tempData = byteArr.subarray(offSet).reverse().reduce((a,c,i)=> a+(c-complement)*2**(56-i*8),startNum);
        }
        else{
            tempData = byteArr.subarray(offSet).reduce((a,c,i)=> a+(c-complement)*2**(56-i*8),startNum);
        }

        if(Number.isSafeInteger(tempData)){
            return tempData;
        }
        throw "Number must be Number.isSafeInteger range"
    }
    
    public static BytesToUInt8(byteArr: Uint8Array, offSet: number = 0): number{
        return (byteArr[offSet]);
    }
    public static BytesToUInt16(byteArr: Uint8Array, offSet: number = 0): number{
        return BitConverter.BytesToInt16(byteArr, offSet)>>>0
    }
    public static BytesToUInt32(byteArr: Uint8Array, offSet: number = 0): number{
        return BitConverter.BytesToInt32(byteArr, offSet)>>>0
    }
    public static BytesToUInt64(byteArr: Uint8Array, offSet: number = 0): number{
        let tempData: number = undefined;
        
        if(BitConverter.IsLittleEndian){
            tempData = byteArr.subarray(offSet).reverse().reduce((a,c,i)=> a+c*2**(56-i*8),0);
        }
        else{
            tempData = byteArr.subarray(offSet).reduce((a,c,i)=> a+c*2**(56-i*8),0);
        }

        if(Number.isSafeInteger(tempData))
            return tempData;
        throw "Number must be Number.isSafeInteger range"
    }

    /**
     * 문자열을 Uint8Array로 변환합니다
     * @param data 변환할 문자열
     * @param type 문자열 타입 - 기본적으로 utf-16 을 사용한다
     * @param isNullChar 끝에 Null문자를 추가하는 여부
     */
    public static StringToBytes(data: string, type: StringType | string = StringType.Utf16, isNullChar: boolean = false): Uint8Array{
        let dataArray: Uint8Array;
        let tempArray: Uint8Array;
        switch (type) {
            case StringType.Utf16: // TextEncoder 가 utf-16을 지원하지 않는다.
                let bytes = [];
                for (let i = 0; i < data.length; i++) {
                    const code = data.charCodeAt(i); // x00-xFFFF
                    bytes.push(code & 255, code >> 8); // low, high
                }
                tempArray = new Uint8Array(bytes);
                dataArray = new Uint8Array(tempArray.length + 2)
                break;
            case StringType.Utf8:
                tempArray = new TextEncoder().encode(data) // 기본적으로 "utf-8" 기반으로 작동함
                dataArray = new Uint8Array(tempArray.length + 1)
                break;
        }

        if(!isNullChar)
        {
            return tempArray;
        }
        dataArray.set(tempArray,0)
        return dataArray;
    }
    public static BytesToString(data: Uint8Array, type: StringType | string = StringType.Utf16): string{
        switch (type) {
            case StringType.Utf16: // TextDecoder 가 utf-16을 지원하지 않는다.
                let stringTemp: string = "";
                for (let i = 0; i < data.length / 2; i++) {
                    stringTemp += String.fromCharCode(data[(i*2)]  + (data[(i*2) + 1] << 8));
                }
                return stringTemp;
            case StringType.Utf8:
                return new TextDecoder(type).decode(data); // Node js 구현과 다르게 "utf-8" 만 작동함 
        }
    }
    
    public static CharSize(type: StringType | string) : number{
        switch (type) {
            case StringType.Utf16:
                return 2;
            case StringType.Utf8:
                return 1;
        }
    }
}

export enum StringType{
    Utf16 = "utf-16",
    Utf8 = "utf-8",
} 