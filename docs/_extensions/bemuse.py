
from os import system
from docutils import nodes
from docutils.parsers.rst import Directive

def setup(app):
    app.add_role('github', autolink('https://github.com/%s'))
    app.add_role('module', autolink('https://github.com/bemusic/bemuse/tree/master/src/%s'))
    app.add_role('tree', autolink('https://github.com/bemusic/bemuse/tree/master/%s'))
    app.add_directive('codedoc', Codedoc)
    app.connect('builder-inited', autogen)

def autolink(pattern):
    def role(name, rawtext, text, lineno, inliner, options={}, content=[]):
        url = pattern % (text,)
        node = nodes.reference(rawtext, text, refuri=url, **options)
        return [node], []
    return role

def autogen(app):
    system('rm -rf modules _codedoc')
    system('python generate.py')

class Codedoc(Directive):
    required_arguments = 1
    final_argument_whitespace = True
    def run(self):
        path = '_codedoc/%s.txt' % (self.arguments[0])
        self.state.document.settings.record_dependencies.add(path)
        with open(path) as f:
            data = f.read()
        self.state_machine.insert_input(data.splitlines(), path)
        return []

