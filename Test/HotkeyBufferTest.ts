import {
    assertThrows,
    assertEquals,
    assertNotEquals,
    runTests,
    test
} from "https://deno.land/std/testing/mod.ts";

import HotkeyBuffer from "../HotkeyBuffer.ts"
import { StringType } from "../BitConverter.ts";

test({
    name: "Test UInt8",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 100
        buffer.append_UInt8(appendData);
        let extractData = buffer.extract_UInt8();
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test UInt16",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 10000
        buffer.append_UInt16(appendData);
        let extractData = buffer.extract_UInt16();
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test UInt32",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 100000000
        buffer.append_UInt32(appendData);
        let extractData = buffer.extract_UInt32();
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test UInt64",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 10000000000
        buffer.append_UInt64(appendData);
        let extractData = buffer.extract_UInt64();
        assertEquals(appendData, extractData);
    }
});


test({
    name: "Test Int8",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 100
        buffer.append_Int8(appendData);
        let extractData = buffer.extract_Int8();
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test Int16",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 10000
        buffer.append_Int16(appendData);
        let extractData = buffer.extract_Int16();
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test Int32",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 100000000
        buffer.append_Int32(appendData);
        let extractData = buffer.extract_Int32();
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test Int64",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: number = 10000000000
        buffer.append_Int64(appendData);
        let extractData = buffer.extract_Int64();
        assertEquals(appendData, extractData);
    }
});

test({
    name: "Test String(utf-16)",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: string = "this is test string 한글도 가능 1234567!@#$%%^&}¢‡¥”w¯¥„ÈÉÞ´µ½²ÂÄÂÁ¾¿ÀÁÂ";
        buffer.append_String(appendData);
        let extractData = buffer.extract_String();
        assertEquals(appendData, extractData);
    }
});-
test({
    name: "Test Text(utf-16)",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: string = "this is test string 한글도 가능 1234567!@#$%%^&}¢‡¥”w¯¥„ÈÉÞ´µ½²ÂÄÂÁ¾¿ÀÁÂ";
        buffer.append_Text(appendData);
        let extractData = buffer.extract_Text();
        assertEquals(appendData, extractData);
    }
});

test({
    name: "Test String(utf-8)",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: string = "!#$%^ %godream1^^%@ Hello Tạm biệt ഗുഡ്ബൈ 高仁福 나라말싸미, 말싸밓, 말쌓밒";
        buffer.append_String(appendData, StringType.Utf8);
        let extractData = buffer.extract_String(StringType.Utf8);
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test Text(utf-8)",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);
        let appendData: string = "!#$%^ %godream1^^%@ Hello Tạm biệt ഗുഡ്ബൈ 高仁福 나라말싸미, 말싸밓, 말쌓밒";
        buffer.append_Text(appendData, StringType.Utf8);
        let extractData = buffer.extract_Text(StringType.Utf8);
        assertEquals(appendData, extractData);
    }
});
test({
    name: "Test AllData",
    fn(): void {
        let buffer: HotkeyBuffer = new HotkeyBuffer(1024);

        let appendData1: number = 240;
        buffer.append_UInt8(appendData1);
        let extractData1 = buffer.extract_UInt8();
        assertEquals(appendData1, extractData1, "append UInt8");

        let appendData2: number = 240;
        buffer.append_UInt16(appendData1);
        let extractData2 = buffer.extract_UInt16();
        assertEquals(appendData2, extractData2, "append UInt16");

        let appendData3: number = 240;
        buffer.append_UInt32(appendData1);
        let extractData3 = buffer.extract_UInt32();
        assertEquals(appendData3, extractData3, "append UInt32");

        let appendData: string = "!#$%^ %godream1^^%@ Hello Tạm biệt ഗുഡ്ബൈ 高仁福 나라말싸미, 말싸밓, 말쌓밒";
        buffer.append_Text(appendData, StringType.Utf8);
        let extractData = buffer.extract_Text(StringType.Utf8);

        assertEquals(appendData, extractData, "append UInt8");
    }
});

runTests();