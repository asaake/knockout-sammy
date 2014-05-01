# Copyright Joyent, Inc. and other Node contributors.
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to permit
# persons to whom the Software is furnished to do so, subject to the
# following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
# NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
# OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
# USE OR OTHER DEALINGS IN THE SOFTWARE.
define [

], (

) ->
  class Path

    # resolves . and .. elements in a path array with directory names there
    # must be no slashes, empty elements, or device names (c:\) in the array
    # (so also no leading and trailing slashes - it does not distinguish
    # relative and absolute paths)
    normalizeArray = (parts, allowAboveRoot) ->

      # if the path tries to go above the root, `up` ends up > 0
      up = 0
      i = parts.length - 1

      while i >= 0
        last = parts[i]
        if last is "."
          parts.splice i, 1
        else if last is ".."
          parts.splice i, 1
          up++
        else if up
          parts.splice i, 1
          up--
        i--

      # if the path is allowed to go above the root, restore leading ..s
      if allowAboveRoot
        while up--
          parts.unshift ".."
          up
      parts

    # Split a filename into [root, dir, basename, ext], unix version
    # 'root' is just a slash, or nothing.
    splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
    splitPath = (filename) ->
      splitPathRe.exec(filename).slice 1


    # path.resolve([from ...], to)
    # posix version
    @resolve: ->
      resolvedPath = ""
      resolvedAbsolute = false
      i = arguments.length - 1

      while i >= -1 and not resolvedAbsolute
        path = (if (i >= 0) then arguments[i] else process.cwd())

        # Skip empty and invalid entries
        unless typeof path is "string"
          throw new TypeError("Arguments to path.resolve must be strings")
        else continue  unless path
        resolvedPath = path + "/" + resolvedPath
        resolvedAbsolute = path.charAt(0) is "/"
        i--

      # At this point the path should be resolved to a full absolute path, but
      # handle relative paths to be safe (might happen when process.cwd() fails)

      # Normalize the path
      resolvedPath = normalizeArray(resolvedPath.split("/").filter((p) ->
        !!p
      ), not resolvedAbsolute).join("/")
      (((if resolvedAbsolute then "/" else "")) + resolvedPath) or "."


    # path.normalize(path)
    # posix version
    @normalize: (path) ->
      isAbsolute = @isAbsolute(path)
      trailingSlash = path[path.length - 1] is "/"
      segments = path.split("/")
      nonEmptySegments = []

      # Normalize the path
      i = 0

      while i < segments.length
        nonEmptySegments.push segments[i]  if segments[i]
        i++
      path = normalizeArray(nonEmptySegments, not isAbsolute).join("/")
      path = "."  if not path and not isAbsolute
      path += "/"  if path and trailingSlash
      ((if isAbsolute then "/" else "")) + path


    # posix version
    @isAbsolute: (path) ->
      path.charAt(0) is "/"


    # posix version
    @join: ->
      path = ""
      i = 0

      while i < arguments.length
        segment = arguments[i]
        type = typeof segment
        throw new TypeError("Arguments to path.join must be strings")  if type is "function" or type is "object" or type is "array"
        segment = segment.toString()
        if segment
          unless path
            path += segment
          else
            path += "/" + segment
        i++
      @normalize path


    # path.relative(from, to)
    # posix version
    @relative: (from, to) ->
      trim = (arr) ->
        start = 0
        while start < arr.length
          break  if arr[start] isnt ""
          start++
        end = arr.length - 1
        while end >= 0
          break  if arr[end] isnt ""
          end--
        return []  if start > end
        arr.slice start, end - start + 1
      from = @resolve(from).substr(1)
      to = @resolve(to).substr(1)
      fromParts = trim(from.split("/"))
      toParts = trim(to.split("/"))
      length = Math.min(fromParts.length, toParts.length)
      samePartsLength = length
      i = 0

      while i < length
        if fromParts[i] isnt toParts[i]
          samePartsLength = i
          break
        i++
      outputParts = []
      i = samePartsLength

      while i < fromParts.length
        outputParts.push ".."
        i++
      outputParts = outputParts.concat(toParts.slice(samePartsLength))
      outputParts.join "/"

    @sep = "/"
    @delimiter = ":"
    @extname: (path) ->
      splitPath(path)[3]
