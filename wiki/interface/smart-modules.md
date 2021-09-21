## Overview
The connection between smart module and the gateway 

## Sync
[not currently defined]

## Gateway main address
Is the transmitting address and the address of data pipe-0 of its nRF module, all the smart modules of the network must listen to this address for the requests from the gateway, it's illegal for the modules to send responses to this address, only auto acknowledgments are allowed, but instead the modules send their responses to the gateway main address plus an offset ROFF defined in the INFO field of the request packet header, and a zero value for ROFF means that the smart module should acknowledge the recaption of the packet only without sending a response.

## Idle timeout
If a smart module didn't receive any packet for 5 seconds, it must consider the connection with the gateway is lost, and the smart module should enter [sync](#sync) mode.


## Packets
### INFO field
is the first byte of any packet sent from the gateway
| Mnemonic | bit | description                                                                                 |
| -------- | --- | ------------------------------------------------------------------------------------------- |
| Reserved | 7:3 | -                                                                                           |
| ROFF     | 2:0 | The offset from the gateway main address that a response for this request should be sent to |

**NOTE:** zero value of ROFF means that the smart module must not send a response packet back to the gateway even if not responding with a response packet violates the protocol of dealing with this type of requests.   

### Keep-alive packets
if the gateway didn't send any packets to a device for 4 - 3 seconds, it sends keep-alive packet to that device to maintain the connection between the gateway and the smart module and reset its idle timeout timer when there is no actual requests needed from that module.

## request timeout
A response from the module is expected to be within 25 milliseconds counted down from the moment that the gateway receives an acknowledgement for the request packet, if the timeout passes without receiving a response, the gateway considers the request to be failed and will re-queue that request and try again later, and it's illegal for the module to respond after the timeout and must give up retrying to send the response packet.

## Packet loss
dealing with devices of high packet loss is managed by the gateways analytics module which defines this rules to save the gateways resources.

- Case 1: No acknowledgment received

if a smart module failed to send an acknowledgment back to the gateway for 5 times in a row, it will be removed from the network and a [Sync](#sync) event will be scheduled for this module.

- Case 2: request timeout

if a module hits the request timeout 5 times in a row, the requests sent to this smart module will be low prioritized to let greater time slices for faster modules.

after the 15th time it hits the request timeout in a row, it will be considered as malfunctioned device and will be disconnected from the network and a resync won't be scheduled unless the user re-enables it manually from the user application.  
