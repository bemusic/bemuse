
from os import system
from docutils import nodes
from docutils.parsers.rst import Directive

def setup(app):
    app.add_role('github', autolink('https://github.com/%s'))
    app.add_role('module', autolink('https://github.com/bemusic/bemuse/tree/master/src/%s'))
    app.add_role('tree', autolink('https://github.com/bemusic/bemuse/tree/master/%s'))
    app.add_role('src', autolink('https://github.com/bemusic/bemuse/tree/master/src/%s'))

    # >> docs/codedoc-usage
    # To include that codedoc, use the ``codedoc`` directive::
    #
    #   .. codedoc:: game/input
    app.add_directive('codedoc', Codedoc)
    app.add_directive('src', SourceCodeLink)
    app.connect('builder-inited', autogen)

def autolink(pattern):
    def role(name, rawtext, text, lineno, inliner, options={}, content=[]):
        url = pattern % (text,)
        node = nodes.reference(rawtext, text, refuri=url, **options)
        return [node], []
    return role

def autogen(app):
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

import re
import hashlib

class SourceLinkRegion(object):
    def __init__(self, path, name, start):
        self.path = path
        self.name = name
        self.start = start
        self.end = start
        self.contents = []
    def add(self, line):
        self.end += 1
        self.contents.append(line)
    def __repr__(self):
        return '#region "%s" @ %s:%d-%d' % (self.name,
            self.path, self.start, self.end)
    def hash(self):
        text = re.sub(r'[^\w]', '', '\n'.join(self.contents))
        sha = hashlib.sha1()
        sha.update(text)
        return sha.hexdigest()[0:8]

class SourceLinkParser(object):
    def __init__(self):
        self.files = {}
    def get(self, path):
        if path in self.files:
            return self.files[path]
        else:
            result = self.parse(path)
            self.files[path] = result
            return result
    def parse(self, path):
        regions = {}
        in_region = None
        with open('../' + path) as f:
            line_number = 0
            for line in f:
                line_number += 1
                text = line.strip()
                if text.startswith('//#region'):
                    in_region = SourceLinkRegion(path, text[10:], line_number)
                elif text == '//#endregion':
                    in_region.end += 1
                    regions[in_region.name] = in_region
                    in_region = None
                elif in_region is not None:
                    in_region.add(line)
        return regions

import os

SLP = SourceLinkParser()
HEAD = os.popen('git rev-parse --short HEAD').read().strip()

class SourceCodeLink(Directive):
    has_content = True
    def run(self):
        ul = nodes.bullet_list()
        outdated = False
        for item in self.content:
            split = item.split(' @ ')
            path = split[0]
            region_name = split[1]
            specified_hash = split[2] if len(split) >= 3 else ''
            regions = SLP.get(path)
            region = regions[region_name]
            li = nodes.list_item()
            ul += li
            p = nodes.paragraph('', '')
            li += p
            p += nodes.Text('Defined at ')
            text = '%s:%d-%d' % (region.path, region.start, region.end)
            url = 'https://github.com/bemusic/bemuse/blob/%s/%s#L%d-%d' % (
                HEAD, region.path, region.start, region.end)
            p += nodes.reference('', text, refuri=url)
            expected_hash = region.hash()
            p += nodes.Text(' (%s)' % (region_name,))
            if specified_hash != expected_hash:
                p += nodes.Text(' [outdated: %s]' % (expected_hash,))
                li['classes'].append('outdated')
                outdated = True
        admonition = nodes.admonition()
        admonition['classes'].append('srcref')
        if outdated: admonition['classes'].append('outdated')
        admonition += nodes.title('', 'Source code reference')
        admonition += ul
        # path = '..//%s.txt' % (self.arguments[0])
        # self.state.document.settings.record_dependencies.add(path)
        # with open(path) as f:
        #     data = f.read()
        # self.state_machine.insert_input(data.splitlines(), path)
        return [admonition]

