
Coding Guidelines
-----------------

- Use [editorconfig](http://editorconfig.org/) to make sure we use indentations and newlines consistently.
- Always lint JavaScript code before committing. This helps reduce extraneous commits.
- The coding style is similar to [npm's coding style](https://docs.npmjs.com/misc/coding-style), with these main differences:
    - Put commas last.
    - Put trailing commas when object/arrays span multiple lines.
- Take a look at:
    - [.editorconfig](.editorconfig)
    - [.jscsrc](.jscsrc)
    - [.jshintrc](.jshintrc)


Commit Message Guidelines
-------------------------

Follow [Angular's guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).
It looks like this:

```
feat(Notechart): implement scrolling effect

- Add a new BMS directive, `#SCROLLxx yyy.zzz` to control the scrolling factor.
- Assign a BMS channel `#xxxSC` to hold scrolling objects.

Closes #xx
```

In the first line,

- Types may be: __feat, fix, docs, style, refactor, perf, test, chore__
    - Meanings same as [Angular](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#type).
- Scope is where the change was made.
    - This one is optional; use when applicable.
- Subject
    - Be short and concise.
    - Start with lower case verb, don't end with a period.
    - To validate, try putting "Let's" in front and add "!" after and see if it makes sense.
        - The above example becomes "Let's implement scrolling effect!"

