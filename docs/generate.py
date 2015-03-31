
# http://stackoverflow.com/questions/2186525/use-a-glob-to-find-files-recursively-in-python
import os
import re
import errno
import fnmatch
from itertools import groupby

def get_source_files():
    return (root + '/' + filename
        for root, dirnames, filenames in os.walk('../src')
            for filename in fnmatch.filter(filenames, '*.js'))

def mkpath(path):
    try:
        os.makedirs(path)
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise

def indent3(x):
    return '\n'.join('   ' + line for line in x.splitlines())

COMMENT_RE      = re.compile(r'^//(?: (.*$)|$)')
CLASS_RE        = re.compile(r'^export class (\w+)')
EXPORT_LET_RE   = re.compile(r'^export let (\w+)')
CONSTRUCTOR_RE  = re.compile(r'^constructor\((.*?)\) \{$')
METHOD_RE       = re.compile(r'^(\w+\(.*?\)) {$')
GETTER_RE       = re.compile(r'^get (\w+)\(\) {$')
ATTRIBUTE_RE    = re.compile(r'^this.(\w+) =')
MODULE_RE       = re.compile(r'src/(.*?)\.js$')

class FileProcessor(object):

    def __init__(self, path, root):
        self.root = root
        self.path = path
        self.buffer = None

    def module_doc(self):
        match = MODULE_RE.search(self.path)
        modulename = match.group(1)
        return self.root.module(modulename)

    def process(self):
        self.state = None
        self.current_class = None
        with open(self.path, 'r') as f:
            for line in f:
                self.current_line = line.strip()
                self.process_line()

    def match(self, regex):
        match = regex.match(self.current_line)
        self.current_match = match
        return match

    def group(self, group):
        return self.current_match.group(group)

    def process_line(self):
        if self.match(COMMENT_RE):
            if self.buffer is None: self.buffer = []
            self.buffer.append(self.group(1) or '')
        elif self.buffer is not None:
            self.post_state = None
            self.process_post_comment()
            self.buffer = None

    def process_post_comment(self):
        if self.post_state is None:
            if self.match(CLASS_RE):
                module_node = self.module_doc()
                class_node = self.current_class = ClassNode(self.group(1))
                module_node.add(class_node)
                class_node.add_text(self.buffer)
                self.post_state = 'class'
            elif self.current_class and self.match(METHOD_RE):
                method_node = MethodNode(self.group(1))
                method_node.add_text(self.buffer)
                self.current_class.add(method_node)
            elif self.current_class and (self.match(GETTER_RE) or self.match(ATTRIBUTE_RE)):
                attr_node = AttributeNode(self.group(1))
                attr_node.add_text(self.buffer)
                self.current_class.add(attr_node)
            elif self.match(EXPORT_LET_RE):
                data_node = DataNode(self.group(1))
                data_node.add_text(self.buffer)
                self.module_doc().add(data_node)
        elif self.post_state == 'class':
            if self.match(CONSTRUCTOR_RE):
                self.current_class.arguments = self.match(1)

class RootNode(object):
    def __init__(self):
        self.modules = { }
    def module(self, module_name):
        if module_name in self.modules:
            return self.modules[module_name]
        else:
            node = self.modules[module_name] = ModuleNode(module_name)
            return node

class Node(object):
    def __init__(self, *args):
        self.contents = []
        self.initialize(*args)
    def add(self, item):
        self.contents.append(item)
    def add_text(self, buf):
        self.contents.append('\n'.join(buf))
    def text_contents(self):
        return '\n\n'.join(map(str, self.contents))

class ModuleNode(Node):
    def initialize(self, name):
        self.name = name
    def __str__(self):
        return (
            self.name + '\n' +
            '=' * len(self.name) + '\n' +
            self.text_contents())

class ClassNode(Node):
    def initialize(self, name):
        self.name = name
        self.arguments = ''
    def __str__(self):
        return (
            '.. js:class:: ' + self.name + '(' + self.arguments + ')\n\n' +
            indent3(self.text_contents()))

class MethodNode(Node):
    def initialize(self, name):
        self.name = name
    def __str__(self):
        return (
            '.. js:function:: ' + self.name + '\n\n' +
            indent3(self.text_contents()))

class AttributeNode(Node):
    def initialize(self, name):
        self.name = name
    def __str__(self):
        return (
            '.. js:attribute:: ' + self.name + '\n\n' +
            indent3(self.text_contents()))

class DataNode(Node):
    def initialize(self, name):
        self.name = name
    def __str__(self):
        return (
            '.. js:data:: ' + self.name + '\n\n' +
            indent3(self.text_contents()))


def main():
    root = RootNode()
    for path in get_source_files():
        processor = FileProcessor(path, root)
        processor.process()
    for key in root.modules:
        filename = 'modules/' + key + '.rst'
        mkpath(os.path.dirname(filename))
        print filename
        with open(filename, 'w') as f:
            f.write(str(root.modules[key]))
    with open('modules/index.rst', 'w') as f:
        print >> f, 'Modules Index'
        print >> f, '============='
        print >> f, '.. toctree::'
        print >> f, '   :maxdepth: 2'
        print >> f, ''
        for key in sorted(root.modules):
            print >> f, '   ' + key

if __name__ == '__main__':
    main()
