import { nearley, jql_grammer } from '../../src/parser/parser'
import { transpile2SQL } from '../../src/parser/transpiler'


{
  const expr:string = 'a = b';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a = b');
  });
}

{
  const expr:string = 'a != b';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a != b');
  });
}

{
  const expr:string = 'a > b';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a > b');
  });
}

{
  const expr:string = 'a < b';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a < b');
  });
}

{
  const expr:string = 'a >= b';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a >= b');
  });
}

{
  const expr:string = 'a <= b';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a <= b');
  });
}

{
  const expr:string = 'a = b and c = d';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a = b and c = d');
  });
}

{
  const expr:string = 'a=b     or      c     =     d';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('a = b or c = d');
  });
}

{
  const expr:string = '(a=b)';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('(a = b)');
  });
}

{
  const expr:string = '(((a=b)))';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('(((a = b)))');
  });
}

{
  const expr:string = '(((a=b))and(c=d))';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('(((a = b)) and (c = d))');
  });
}

{
  const expr:string = '(a=b and c=d)or(e=f)';

  it(expr, () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(jql_grammer));
    parser.feed(expr);
    const exps = parser.results;
    const where = transpile2SQL(exps[0], []);
    expect(where).toBe('(a = b and c = d) or (e = f)');
  });
}
