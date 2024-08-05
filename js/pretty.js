document.addEventListener('DOMContentLoaded', function () {
  const link = document.getElementById('pretty-button');
  // onClick's logic below:
  link.addEventListener('click', function () {
    prettyJson(document.getElementById('input').value);
  });
});

function prettyJson(inp) {
  try {
    let str;
    if (typeof inp === 'string' && inp.startsWith("\"")) {
      let inpNonQuotes = inp.replaceAll(/^"+|"+$/g, "").trim();
      if (inpNonQuotes.startsWith("{") || inpNonQuotes.startsWith("[")) {
        str = inp.replaceAll(/^"+|"+$/g, "");
        str = str.replaceAll(/\\"/g, "\"")
        str = str.replaceAll(/\\r\\n/g, "")
        console.log(str)
        str = JSON.parse(str);
      } else {
        str = inp.replace(/"[^"]+",/, "")
        console.log(str)
        str = str.trim().replaceAll(/^"+|"+$/g, "")
        str = str.replaceAll(/\\r/g, "")
        str = str.replaceAll(/\\n/g, "")
        console.log(str)
        str = JSON.parse(str)
      }
    } else {
      str = JSON.parse(inp)
    }

    output(syntaxHighlight(JSON.stringify(str, undefined, 4)));
  } catch (e) {
    try {
      prettyXml(inp)
    } catch (e2) {
      alert(e2.message)
    }

  }
}

function output(inp) {
  document.getElementById("input2").innerHTML = inp
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
      '&gt;');
  return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
}

function formatXml(xml, colorize, indent) {
  function esc(s) {
    return s.replace(/[-\/&<> ]/g, function (c) {         // Escape special chars
      return c === ' ' ? '&nbsp;' : '&#' + c.charCodeAt(0) + ';';
    });
  }

  let sm = '<div class="xmt">', se = '<div class="xel">',
      sd = '<div class="xdt">',
      sa = '<div class="xat">', tb = '<div class="xtb">',
      tc = '<div class="xtc">',
      ind = indent || '  ', sz = '</div>', tz = '</div>', re = '', is = '', ib,
      ob, at, i;
  if (!colorize) {
    sm = se = sd = sa = sz = '';
  }
  xml.match(/(?<=<).*(?=>)|$/s)[0].split(/>\s*</).forEach(function (nd) {
    ob = ('<' + nd + '>').match(/^(<[!?\/]?)(.*?)([?\/]?>)$/s);             // Split outer brackets
    ib = ob[2].match(/^(.*?)>(.*)<\/(.*)$/s) || ['', ob[2], ''];            // Split inner brackets
    at = ib[1].match(/^--.*--$|=|(['"]).*?\1|[^\t\n\f \/>"'=]+/g) || ['']; // Split attributes
    if (ob[1] === '</') {
      is = is.substring(ind.length);
    }                     // Decrease indent
    re += tb + tc + esc(is) + tz + tc + sm + esc(ob[1]) + sz + se + esc(at[0])
        + sz;
    for (i = 1; i < at.length; i++) {
      re += (at[i] === "=" ? sm + "=" + sz + sd + esc(at[++i]) : sa + ' '
          + at[i]) + sz;
    }
    re += ib[2] ? sm + esc('>') + sz + sd + esc(ib[2]) + sz + sm + esc('</')
        + sz + se + ib[3] + sz : '';
    re += sm + esc(ob[3]) + sz + tz + tz;
    if (ob[1] + ob[3] + ib[2] === '<>') {
      is += ind;
    }                             // Increase indent
  });
  return re;
}

function outputXml(inp) {
  document.getElementById("input2").innerHTML = "<code class='language-xml'>"
      + formatXml(inp, true) + "</code>"
}

function whiteSpaceCount(input) {
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === ' ') {
      ++count;
    } else {
      break
    }
  }
  return count;
}

const prettifyXml = function (sourceXml) {
  let sourceXmlNoQuotes = sourceXml.replaceAll(/^"+|"+$/g, "");
  if (!sourceXmlNoQuotes.startsWith('<')) {
    sourceXml = sourceXml.replace(/"[^"]+",/, "").trim()
    sourceXml = sourceXml.replaceAll(/^"+|"+$/g, "");
  } else {
    sourceXml = sourceXml.replaceAll(/^"+|"+$/g, "");
  }
  sourceXml = sourceXml.replaceAll(/\\n/g, "")
  const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
  const xsltDoc = new DOMParser().parseFromString([
    // describes how we want to modify the XML - indent everything
    '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">',
    '  <xsl:strip-space elements="*"/>',
    '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
    '    <xsl:value-of select="normalize-space(.)"/>',
    '  </xsl:template>',
    '  <xsl:template match="node()|@*">',
    '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
    '  </xsl:template>',
    '  <xsl:output indent="yes"/>',
    '</xsl:stylesheet>',
  ].join('\n'), 'application/xml');

  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDoc);
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  let result = new XMLSerializer().serializeToString(resultDoc);
  result = result.replaceAll(/&lt;/g, "<")
  result = result.replaceAll(/&gt;/g, ">")
  return result;
};

function prettyXml(input) {
  let result = prettifyXml(input)
  if (result.includes('<![CDATA[')) {
    let pattern = /<!\[CDATA\[(.+)\]\]>/;
    let searchStringPattern = /.+?(?=CDATA)/
    let replacePattern = /(?<=<!\[CDATA\[)(.*)(?=]]>)/
    let inner = prettifyXml(result.match(pattern)[1]);
    let whiteSpacesString = result.match(searchStringPattern)[0]
    let countWhiteSpace = whiteSpaceCount(whiteSpacesString)
    let innerStrings = inner.split("\n")
    let innerStringWithWhiteSpaces = []
    let whiteSpaces = '';
    for (let j = 0; j < countWhiteSpace; j++) {
      whiteSpaces = whiteSpaces + ' ';
    }
    innerStrings.forEach(i => {
      innerStringWithWhiteSpaces.push(whiteSpaces + i)
    })
    inner = '\n ' + innerStringWithWhiteSpaces.join('\n') + '\n' + whiteSpaces;
    result = result.replace(replacePattern, inner)
  }
  outputXml(result)
}