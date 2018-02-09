---
permalink: /fr/research/histograph/
link: /research/histograph/
layout: project
lang: fr
website:
  url: http://histograph.eu/

title: histograph
subheading: Graph-based exploration and crowd-based indexation for multimedia collections

---

**Histograph** treats multimedia collections as networks. The underlying assumption is simple: if two people are mentioned together in a document, we assume that they may have something to do with each other, whether or not such a relationship is interesting is in the eye of the beholder. Co-occurrence networks become huge and unwieldy very quickly, which forces us to filter them based on another simple assumption: the more often entities co-occur, the more likely it is that they have a meaningful relationship with each other. We combine these two assumptions with mathematical models (co-occurrence frequencies weighted by tf-idf specificity and Jaccard distances) which allow us to rank the list of co-occurrences. This tells us who appears with whom and in which documents.

<!-- more -->

...