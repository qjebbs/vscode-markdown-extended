export class StopWatch {
    public startTime: Date
    public endTime: Date
    constructor() {
        this.start();
    }
    start() {
        this.startTime = new Date();
        this.endTime = undefined;
    }
    stop(): number {
        this.endTime = new Date();
        return this.duration;
    }
    get duration(): number {
        if (this.endTime)
            return this.endTime.getTime() - this.startTime.getTime();
        else
            return new Date().getTime() - this.startTime.getTime();
    }
}