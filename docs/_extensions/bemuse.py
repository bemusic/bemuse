
from docutils import nodes
from os import system

def setup(app):
    app.add_role('github', autolink('https://github.com/%s'))
    app.add_role('module', autolink('https://github.com/bemusic/bemuse/tree/master/src/%s'))
    app.add_role('tree', autolink('https://github.com/bemusic/bemuse/tree/master/%s'))
    app.connect('builder-inited', autogen)

def autolink(pattern):
    def role(name, rawtext, text, lineno, inliner, options={}, content=[]):
        url = pattern % (text,)
        node = nodes.reference(rawtext, text, refuri=url, **options)
        return [node], []
    return role

def autogen(app):
    system('rm -rf modules')
    system('python generate.py')
