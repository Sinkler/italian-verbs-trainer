#!/usr/bin/env python
import os
import csv
import json

output = u''
base_dir = os.path.realpath(os.path.dirname(os.path.dirname(__file__)))
csv_keys = [
    'verb',
    'impersonalForms',
    'presentIndicative',
    'imperfectIndicative',
    'futureIndicative',
    'pastRemoteIndicative',
    'pastIndicative',
    'pluperfectIndicative',
    'futurePerfectIndicative',
    'pluperfectRemoteIndicative',
    'presentSubjunctive',
    'imperfectSubjunctive',
    'pastSubjunctive',
    'pluperfectSubjunctive',
    'presentConditional',
    'pastConditional',
    'imperative',
    'similarVerbs',
]

with open(os.path.join(base_dir, 'swadesh.txt')) as f:
    swadesh = f.readlines()
    swadesh = map(lambda x: x.split(' ')[0].strip(), swadesh)

with open(os.path.join(base_dir, 'verbs_ru.csv')) as f:
    data = []
    for row in csv.reader(f):
        d = {}
        for i, r in enumerate(row):
            d[csv_keys[i]] = r.split(',') if ',' in r else r
        data.append(d)
output += u'var verbs_short = {};'.format(json.dumps(data))

with open(os.path.join(base_dir, 'verbs_duolingo.csv')) as f:
    data = []
    for row in csv.reader(f):
        d = {}
        for i, r in enumerate(row):
            d[csv_keys[i]] = r.split(',') if ',' in r else r
        d['is_swadesh'] = d['verb'] in swadesh
        data.append(d)
output += u'var verbs = {};'.format(json.dumps(data))

with open(os.path.join(base_dir, 'translations_en.csv')) as f:
    translations_en = {}
    for row in csv.reader(f):
        translations_en[row[0]] = row[1]

with open(os.path.join(base_dir, 'translations_ru.csv')) as f:
    translations_ru = {}
    for row in csv.reader(f):
        translations_ru[row[0]] = row[1]

output += u'var translations = [' \
          u'{"lang": "en", "data": %s}, ' \
          u'{"lang": "ru", "data": %s}' \
          u'];' % (json.dumps(translations_en), json.dumps(translations_ru))

output += u'export default {verbs: verbs, verbs_short: verbs_short, translations: translations};'

with open(os.path.join(base_dir, '..', 'src', 'js', 'verbs.js'), 'w') as f:
    f.write(output.encode('utf-8'))
    f.close()
