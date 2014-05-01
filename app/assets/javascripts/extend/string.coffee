String.prototype.stripLeft = (s) ->
  index = 0
  for c in @chars()
    if c != s
      break
    else
      index++

  return @slice(index)

String.prototype.stripRight = (s) ->
  lastIndex = @length
  for c in @chars().reverse()
    if c != s
      break
    else
      lastIndex--

  return @slice(0, lastIndex)

String.prototype.strip = (s) ->
  return @stripLeft(s).stripRight(s)