# nRF24
## Addresses
### Pipes
- **Pipe 0**    has a unique 5 byte address
- **Pipe 1**    has a unique 5 byte address  
- **Pipe 2-4**  only LSB available and Shares the 4 MSB of Pipe 1 address
### ACK
- To ensure that the ACK packet from the PRX is transmitted to the correct PTX the PRX takes the data pipe address where it received the packet and uses it as the TX address when transmitting the ack packet