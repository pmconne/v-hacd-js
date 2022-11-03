A dead-simple wrapper API for [V-HACD](https://github.com/kmammou/v-hacd) to decompose a 3d surface into a set of "near" convex parts. Consult [V-HACD](https://github.com/kmammou/v-hacd) for details.

Usage:

```ts
import { ConvexMeshDecomposition } from "vhacd";
// Create a mesh decomposer. It can be used to decompose as many meshes as you like.
const decomposer = await ConvexMeshDecomposition.create();
// Optionally configure how the decomposition is performed.
const options = { maxHulls: 32 };
// Produce an array of convex hulls.
const hulls = decomposer.computeConvexHulls({ positions, indices }, options);
```
