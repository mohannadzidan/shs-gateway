## Packets

### Direct packet Types
| Type | packet                                                  |
| ---- | ------------------------------------------------------- |
| 0x20 | [Status packet](#status-packet)                         |
| 0xf0 | [Handshake initiate packet](#handshake-initiate-packet) |
| 0xf1 | [Routing packet](#routing-packet)                       |
| 0xf2 | [Command packet](#command-packet)                       |
| 0xfe | [Multi chunk data packet](#multi-chunk-data-packet)     |
| 0xff | [Single chunk data packet](#single-chunk-data-packet)   |

### Routed packet Types
| Type | packet                                                              |
| ---- | ------------------------------------------------------------------- |
| 0xe2 | [Routed command packet](#routed-command-packet)                     |
| 0xee | [Routed multi chunk data packet](#routed-multi-chunk-data-packet)   |
| 0xef | [Routed single chunk data packet](#routed-single-chunk-data-packet) |

### Status packet

| ***byte NO***       |  B1     | B2                           |
| ------------------- |  ------ | ---------------------------- |
| **Reserved For**    |  Type   | Code                         |
| ***Value / Range*** |  `0x20` | [Status Code](#status-codes) |

### Single chunk data packet 

| ***byte NO***       | B1     | B2 → B31 |
| ------------------- | ------ | -------- |
| **Reserved For**    | Type   | payload  |
| ***Value / Range*** | `0xff` |          |

### Multi chunk data packet

| ***byte NO***       | B1     | B2           B4 → B31    |      |
| ------------------- | ------ | ------------------------ | ---- |
| **Reserved For**    | Type   | Chunk NO + end indicator | data |
| ***Value / Range*** | `0xfe` | `1` - `255`  -           |



### Routing packet

typically sent from the Raspberry pi to the Router and implies a 29-byte packet that will be routed to a C-unit connected to the provided port.

| ***byte NO***       | B0            | B1 → B31                              |
| ------------------- | ------------- | ------------------------------------- |
| **Reserved For**    | Type  + Port  | [Routed packet](#routed-packet-types) |
| ***Value / Range*** | `0xf0`-`0xff` | -                                     |

### Command packet

sent from the Raspberry pi to the Router

| ***byte NO***       | B0     | B1          | B2 → B31 |
| ------------------- | ------ | ----------- | -------- |
| **Reserved For**    | Type   | Code        | args     |
| ***Value / Range*** | `0xf2` | `0` - `255` | -        |

### Routed single chunk data packet

A packet that holds 28-byte of raw data 

| ***byte NO***       | B0     | B1 → B28 |
| ------------------- | ------ | -------- |
| **Reserved For**    | Type   | data     |
| ***Value / Range*** | `0xff` |          |

### Routed multi chunk data packet

A packet that holds 28-byte chunk of raw data 

| ***byte NO***     | -                    | B0     | B1                   | B2 → B29 |
| ----------------- | -------------------- | ------ | -------------------- | -------- |
| **Reserved For**  | Computed Packet-size | Type   | Chunk NO + Indicator | Data     |
| **Value / Range** | `0` - `255`          | `0xfe` | `0` - `255`          | -        |

## Command Packets

### Handshake initiation packet

20-byte packet 

| ***byte NO***       | B0          | B1     | B2           | B3          | B4 → B19   |
| ------------------- | ----------- | ------ | ------------ | ----------- | ---------- |
| **Reserved For**    | Packet-Size | Type   | Channel      | Address     | Router UID |
| ***Value / Range*** | `20`        | `0xf0` | `75` - `124` | `0  ` - `5` | -          |