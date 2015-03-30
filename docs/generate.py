
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

class DocumentationBlock(object):
    def __init__(self, name):
        self.name = name
        self.contents = []
    def add(self, content):
        self.contents.append(content)
    def get_text(self):
        return '\n'.join(map(self.to_str, self.contents)).strip()
    def __repr__(self):
        return '<:doc: %s %s>' % (self.name, self.contents)
    def to_str(self, text):
        if type(text) == str:
            return text
        else:
            return '\n' + text.get_text()
    def beget(self, old_block, blocktype=None, *args):
        if blocktype is None: blocktype = DocumentationBlock
        new_block = blocktype(None, *args)
        new_block.add(old_block.get_text())
        self.contents.append(new_block)
        return new_block

class DocumentationGenerator(object):
    def __init__(self, modpath):
        self.blocks = []
        self.modpath = modpath
    def block(self, name):
        return self.add(DocumentationBlock(name))
    def add(self, block):
        self.current = block
        self.blocks.append(self.current)
        return self.current
    def moduledoc(self, blocktype=DocumentationBlock, *args):
        block = blocktype('modules/' + self.modpath + '.rst', *args)
        return self.add(block)
    def beget(self, old_block, blocktype=DocumentationBlock, *args):
        new_block = self.moduledoc(blocktype, *args)
        new_block.add(old_block.get_text())
        return new_block

class ClassDocumentation(DocumentationBlock):
    def __init__(self, name, class_name):
        super(ClassDocumentation, self).__init__(name)
        self.class_name = class_name
        self.class_params = ''
    def get_text(self):
        text = super(ClassDocumentation, self).get_text()
        return (
            '.. js:class:: ' + self.class_name + self.class_params + '\n\n' + indent(text))

class FunctionDocumentation(DocumentationBlock):
    def __init__(self, name, method_name):
        super(FunctionDocumentation, self).__init__(name)
        self.method_name = method_name
    def get_text(self):
        text = super(FunctionDocumentation, self).get_text()
        return (
            '.. js:function:: ' + self.method_name + '\n\n' + indent(text))

class AttributeDocumentation(DocumentationBlock):
    def __init__(self, name, attribute_name):
        super(AttributeDocumentation, self).__init__(name)
        self.attribute_name = attribute_name
    def get_text(self):
        text = super(AttributeDocumentation, self).get_text()
        return (
            '.. js:attribute:: ' + self.attribute_name + '\n\n' + indent(text))

def indent(x):
    return '\n'.join('   ' + line for line in x.splitlines())

METHOD_RE = re.compile(r'(\w+\(.*?\)) {$')
GETTER_RE = re.compile(r'get (\w+)\(\) {$')
ATTRIBUTE_RE = re.compile(r'this.(\w+) =')

def scan_docs(path):
    modpath = os.path.relpath(path, '../src')[:-3]
    generate = DocumentationGenerator(modpath)
    current = None
    implicit_class = None
    implicit_method = None
    implicit_state = None
    with open(path, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('// :doc: '):
                current = generate.block('_gen/' + line[9:])
            elif line == '// :doc:':
                current = generate.moduledoc()
            elif current:
                if line == '//':
                    current.add('')
                elif line.startswith('// '):
                    current.add(line[3:])
                elif current.name is None:
                    if implicit_state is None and line.startswith('export class '):
                        implicit_class = generate.beget(current,
                            ClassDocumentation,
                            line[len('export class '):].split()[0])
                        implicit_state = 'class'
                    elif (implicit_state is None and
                            implicit_state == 'class' and
                            line.startswith('constructor(')):
                        implicit_class.class_params = line[len('constructor'):][:-2]
                        implicit_state = 'done'
                    elif (implicit_state is None and
                            implicit_class is not None and
                            METHOD_RE.match(line)):
                        match = METHOD_RE.match(line)
                        implicit_method = implicit_class.beget(current,
                            FunctionDocumentation,
                            match.group(1))
                        implicit_state = 'done'
                    elif (implicit_state is None and
                            implicit_class is not None and
                            ATTRIBUTE_RE.match(line)):
                        match = ATTRIBUTE_RE.match(line)
                        implicit_method = implicit_class.beget(current,
                            AttributeDocumentation,
                            match.group(1))
                        implicit_state = 'done'
                    elif (implicit_state is None and
                            implicit_class is not None and
                            GETTER_RE.match(line)):
                        match = GETTER_RE.match(line)
                        implicit_method = implicit_class.beget(current,
                            AttributeDocumentation,
                            match.group(1))
                        implicit_state = 'done'
                    else:
                        current = None
                        implicit_state = None
                else:
                    current = None
                    implicit_state = None
            else:
                if line == '//':
                    current = DocumentationBlock(None)
                elif line.startswith('// '):
                    current = DocumentationBlock(None)
                    current.add(line[3:])
                
    return generate.blocks

def get_all_blocks():
    key = lambda doc: doc.name
    return groupby(sorted((doc
        for path in get_source_files()
            for doc in scan_docs(path)), key=key), key)

def main():
    modules = []
    for filename, docs in get_all_blocks():
        mkpath(os.path.dirname(filename))
        print filename
        with open(filename, 'w') as f:
            if filename.startswith('modules/'):
                name = filename[8:][:-4]
                modules.append(name)
                print >> f, name
                print >> f, '=' * len(name)
            print >> f, '\n\n'.join(doc.get_text() for doc in docs)
    with open('modules/index.rst', 'w') as f:
        print >> f, 'Modules Index'
        print >> f, '============='
        print >> f, ''
        print >> f, '.. toctree::'
        print >> f, '   :maxdepth: 2'
        print >> f, ''
        for name in modules:
            print >> f, '   ' + name
            

if __name__ == '__main__':
    main()
