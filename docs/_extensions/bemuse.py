
from docutils import nodes

def setup(app):
    app.add_role('github', Autolink('https://github.com/%s'))
    app.add_role('module', Autolink('https://github.com/bemusic/bemuse/tree/master/src/%s'))

class Autolink:
    def __init__(self, pattern):
        self.pattern = pattern
    def __call__(self, name, rawtext, text, lineno, inliner, options={}, content=[]):
        url = self.pattern % (text,)
        node = nodes.reference(rawtext, text, refuri=url, **options)
        return [node], []

