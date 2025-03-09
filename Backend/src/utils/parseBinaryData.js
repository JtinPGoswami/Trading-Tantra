import { Buffer } from "buffer";

function parseBinaryData(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("Invalid data format, expected a Buffer.");
    }

    console.log("Received buffer length:", buffer.length);

    if (buffer.length < 16) {
        throw new Error("Buffer too small, cannot parse data.");
    }

    return {
        responseCode: buffer.readUInt8(0),   
        unknown1: buffer.readUInt8(1), 
        unknown2: buffer.readUInt16LE(2),    
        latestPrice: buffer.readFloatLE(8), 
        lastTradeTime: buffer.readUInt32LE(12)
    };
}


export default parseBinaryData;
