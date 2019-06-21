export interface IObserver<T> {
    onCompleted(): void;
    onError(error: Error): void;
    onNext(value: T): void;
}
export interface IObservable<T> {
    registerListener(observer: IObserver<T>): void;
    removeListener(observer: IObserver<T>): void;
    notifyObservers(eventType: EventsType, value: T, error?: Error): void;
}
export declare enum EventsType {
    OnError = 0,
    OnCompleted = 1,
    OnNext = 2
}
export declare abstract class EventProvider<T> implements IObservable<T> {
    protected _observers: Array<IObserver<T>>;
    constructor();
    registerListener(observer: IObserver<T>): void;
    removeListener(observer: IObserver<T>): void;
    notifyObservers(eventsType: EventsType, value: T, error?: Error): void;
}
