module tools {
  export function event_chain<T>(f1 :(ev :T) => any, f2 :(ev :T) => any) :(ev :T) => any {
    if (f1) {
      return function() {
        f1.apply(this, arguments);
        f2.apply(this, arguments);
      }
    } else {
      return f2;
    }
  }
}
