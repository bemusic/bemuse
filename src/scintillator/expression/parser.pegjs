{
  function operate(item) {
    var operator = item[1]
    var operand = item[3]
    return " " + operator + " " + operand
  }
  function combine(first, rest) {
    return first + rest.map(operate).join('')
  }
}

expr
  = add

add
  = first:mul rest:(_ ("+" / "-") _ mul)* {
      return combine(first, rest);
    }

mul
  = first:val rest:(_ ("*" / "/" / "%") _ val)* {
      return combine(first, rest);
    }

val
  = "(" _ expr:expr _ ")" { return "(" + expr + ")"; }
  / "!" val:val { return "!" + val }
  / number
  / identifier

number "number"
  = "-"? int frac? exp? { return text(); }

exp           = [eE] ("-" / "+")? [0-9]+
frac          = "." [0-9]+
int           = "0" / ([1-9] [0-9]*)

identifier
  = [a-zA-Z]+[a-zA-Z0-9_]* { return "get(" + JSON.stringify(text()) + ")" }

_ "whitespace"
  = [ \t\n\r]*
