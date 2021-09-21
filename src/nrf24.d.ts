interface nRF24ConfigurationOptions {
    PALevel?: number,
    EnableLna?: boolean,
    DataRate?: number,
    Channel?: number,
    CRCLength?: number,
    retriesCount?: number,
    retriesDelay?: number,
    PayloadSize?: number,
    AddressWidth?: number,
    AutoAck?: boolean,
    Irq?: number,
    PollBaseTime?: number,
    TxDelay?: number,
}

type nRF24ReceiveCallback = (data: Buffer, n: number) => void;
type nRF24StopCallback = (isStopped: boolean, byUser: boolean, errorCount: number) => void;
interface nRF24 {
    config(options: nRF24ConfigurationOptions, printDetails?: boolean): void;
    begin(): void;
    present(): boolean;
    isP(): boolean;
    read(onReceive: nRF24ReceiveCallback, onStop: nRF24StopCallback): void;
    /**
     * Opens and configures a reading pipe
     * @param address the address of the pipe in format of '0xbbbbbbbbbb'
     * @param enableAutoAck enable or disable auto acknowledge
     */
    addReadPipe(address: string, enableAutoAck: boolean): void;
    useWritePipe(address: string, enableAutoAck: boolean): void;
    write(data: Buffer): void;
    stopRead(): void;
    stopWrite(): void;
    destroy(): void;
    restart(): void;
}

interface nRF24Lib {
    RF24_1MBPS: 0,
    RF24_250KBPS: 2,
    RF24_2MBPS: 1,
    RF24_PA_MIN: 0,
    RF24_PA_LOW: 1,
    RF24_PA_HIGH: 2,
    RF24_PA_MAX: 3,
    RF24_PA_ULTRA: unknown,
    RF24_CRC_DISABLED: 0,
    RF24_CRC_8: 1,
    RF24_CRC_16: 2,
    RF24_MAX_MERGEFRAMES: 128,
    RF24_MIN_POLLTIME: 4000,
    RF24_FAILURE_STAT: 7,

}
