import { Buffer } from "buffer";

function parseBinaryData(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Invalid data format, expected a Buffer.");
  }

  // console.log("Received buffer length:", buffer.length);

  if (buffer.length < 162) {
    throw new Error("Buffer too small, expected at least 162 bytes.");
  }

  return {
    responseCode: buffer.readUInt8(0), // Byte 1: Response Code
    messageLength: buffer.readUInt16LE(1), // Bytes 2-3: Message Length
    exchangeSegment: buffer.readUInt8(3), // Byte 4: Exchange Segment
    securityId: buffer.readInt32LE(4), // Bytes 5-8: Security ID (int32)

    latestTradedPrice: buffer.readFloatLE(8),
    lastTradedQty: buffer.readInt16LE(12),
    lastTradeTime: buffer.readUInt32LE(14),
    avgTradePrice: buffer.readFloatLE(18),
    volume: buffer.readUInt32LE(22),
    totalSellQty: buffer.readUInt32LE(26),
    totalBuyQty: buffer.readUInt32LE(30),
    openInterest: buffer.readUInt32LE(34),
    highestOpenInterest: buffer.readUInt32LE(38),
    lowestOpenInterest: buffer.readUInt32LE(42),
    dayOpen: buffer.readFloatLE(46),
    dayClose: buffer.readFloatLE(50),
    dayHigh: buffer.readFloatLE(54),
    dayLow: buffer.readFloatLE(58),

    marketDepth: Array.from({ length: 5 }, (_, i) => {
      const offset = 62 + i * 20;
      return {
        price: buffer.readFloatLE(offset),
        quantity: buffer.readUInt32LE(offset + 4),
        orders: buffer.readUInt32LE(offset + 8),
        buySell: buffer.readUInt8(offset + 12),
      };
    }),
  };
}

export default parseBinaryData;
