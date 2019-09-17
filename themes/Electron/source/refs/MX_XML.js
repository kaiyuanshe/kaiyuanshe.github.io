/*
 * This file is a part of Javascript Framework JSMX version 1.2
 * Copyright 2007 HoangKC - http://sulivandinh.googlepages.com
 * Email sulivandinh@gmail.com
 * JSMX framework is freely distributable under the terms of an MIT-style license.
 */
if(typeof MX == "undefined") MX={};	// namespace
MX.XML =
{
	// if arrayMap, all node of xmlDocument will be put into an array
	// if not arrayMap, all single node of xmlDocument wil be treated as property
	ToJSON : function(xmlDoc,arrayMap)
	{
		if(xmlDoc.hasChildNodes())
		{
			var node = this.ParseNode(xmlDoc,arrayMap);
			node["X-Parse-Engine"]="MX.Util.XML";
	        node["X-JSMX-Framework"]="Version 1.2";
			return node;
		}
		return null;
	},
	ParseNode : function(xmlNode,arrayMap)
	{
		var node =
		{
			"$attribute":null,
			"$count":0,
			//"$name":xmlNode.nodeName,
			//"$type":xmlNode.nodeType,
			"$value":""
		};
		var _node = null;
		if(xmlNode.attributes)	// because xmlNode.hasAttributes() method just work in FF
		{
			node["$attribute"] = {};
			for(var i=0,n=xmlNode.attributes.length;i<n;++i)
			{
				_node = xmlNode.attributes[i];
				node["$attribute"][_node.nodeName] = _node.nodeValue;	// or escape(_node.nodeValue)?
			}
		}
		if(xmlNode.hasChildNodes())
		{
			if(xmlNode.firstChild.nodeType==3)
			{
				node["$value"] = xmlNode.firstChild.nodeValue.replace(/\n\r*/g, "").replace(/^\s+/, "").replace(/\s+$/, "");
			}
			var name = "";
			var p = null;
			var count = 0;
			for(var i=0,n=xmlNode.childNodes.length;i<n;++i)
			{
				_node = xmlNode.childNodes[i];
				if(_node.nodeType==3) continue;
				name = _node.nodeName;
				p = this.ParseNode(_node,arrayMap);
				if(node[name]==null)
				{
					node["$count"]++;
					if(!arrayMap)
					{
						count=0;
						for(var c=0,m=xmlNode.childNodes.length;c<m;++c)
						{
							if(xmlNode.childNodes[c].tagName==name)count++;
		            		if(count==2) break;
						}
						if(count==1)
						{
							node[name] = p;
							continue;
						}
					}
					node[name] = [];
				}
				node[name].push(p);
			}
		}
		return node;
	}
}