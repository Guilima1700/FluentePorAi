# Earth imagery

Geographic source assets are retained from the Three.js r187 examples:

- https://github.com/mrdoob/three.js/blob/r187/examples/textures/planets/earth_atmos_2048.jpg
- https://github.com/mrdoob/three.js/blob/r187/examples/textures/planets/earth_normal_2048.jpg
- https://github.com/mrdoob/three.js/blob/r187/examples/textures/planets/earth_specular_2048.jpg

The imagery is bundled locally; visitors do not contact an image CDN. Runtime color mapping fits the existing Fluente por Aí palette without changing geographic outlines. The normal map is skipped on smaller or less capable devices. All graphics resources are released when the component unmounts.

Three.js license: https://github.com/mrdoob/three.js/blob/r187/LICENSE
