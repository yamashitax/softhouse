export class Stack<T> {
  items: Array<T> = [];

  public push(item: T): void {
    this.items.unshift(item);
  }

  public pop(count: number = 1): T | undefined {
    var popped: T | undefined;

    for (var i = 0; i < count; i++) {
      popped = this.items.shift();
    }

    return popped;
  }

  public peek(): T | undefined {
    return this.items[0];
  }

  public length(): number {
    return this.items.length
  }
}
