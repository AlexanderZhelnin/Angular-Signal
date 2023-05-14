
interface ISubscriber
{
  f: () => void;
}

export declare type MySignal<T> = (() => T);

interface IMyWritableSignal<T> extends MySignal<T>
{
  set(value: T): void;
}


let context: ISubscriber | undefined;

export function myEffect(effectFn: () => void): ISubscriber
{
  const result: ISubscriber = { f: effectFn };

  context = result;

  effectFn();

  context = undefined;

  return result;
}

export function mySignal<T>(initialValue: T): IMyWritableSignal<T>
{
  let current = initialValue;
  const subscribes: ISubscriber[] = [];

  const f = function ()
  {
    if (context) subscribes.push(context);

    return current;
  };

  f.set = (value: T) =>
  {
    current = value;

    setTimeout(() => subscribes.forEach(s => s.f()));
  };

  return f;
}
