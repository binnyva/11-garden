---
title: Markdown
tags:
  - language
  - formatting
  - tool
---

Markdown is a lightweight markup language for creating formatted text using plain-text.

## The Basics

You should be able to _do this_ and **this** - basic formatting options. Weirdly, there is no underline in markdown - so no need to do that.

Next, you should be able to create links - like [this](https://standup-philosophy.netlify.app/).

### Images

![Image](imgs/mental_programming.jpg)

![External Image](https://binnyva.com/others/arathi/avatars/profile-1.jpg)

---

## Intermediate

> "You should be able to make stand out text like this"
> Source

### Lists

Two types of lists...

1. Ordered lists
2. Like this.
3. Because numbers.

And...

- Unordered lists
- like this
- No numbers.
- Just bullet points

### Code

You can put `code` in Markdown...

```c
#include <stdio.h>

void main() {
  cout<<"Hello World!"<<endl;
}
```

## Advanced

These are the slightly advanced formatting options.

### Tables

| Language  | 1    | 2     | 3     |
| :-------- | :--- | :---- | :---- |
| English   | One  | Two   | Three |
| Malayalam | Onnu | Randu | Muunu |
| Hindi     | Ek   | Do    | Theen |

### Some special characters...

You should be able to show \*something\* or \`something\` characters(star and backtick)

### HTML

You can use HTML in markdown - here we <u>Underline</u> text using HTML

## Non Standard Markdown

Markdown has too many variants. [[11 Garden]] supports a few non-standard feature that Obsidian(and other PKM tools) have added. Like...

- WikiLinks - [[Understand by Explaining]]
- WikiLinks with custom text - [[Understand by Explaining|custom text]]
- Image insertion - ![[mental_programming.jpg]]
