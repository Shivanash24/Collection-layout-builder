document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("collection-layout-builder-root");
  if (!root) return;

  const products = window.clbProducts || [];
  
  try {
    const response = await fetch('/apps/collection-builder/settings');
    if (!response.ok) throw new Error('Failed to fetch settings');
    
    const data = await response.json();
    const settings = data.settings;
    
    renderLayout(root, products, settings);
  } catch (error) {
    console.error("Collection Layout Builder Error:", error);
    root.innerHTML = '<div style="color: red; padding: 20px;">Failed to load custom layout.</div>';
  }
});

function renderLayout(root, products, settings) {
  const { templateId, productsPerRow, cardRadius, cardShadow, hoverAnimation } = settings;
  
  let gridColumns = \`repeat(\${productsPerRow}, 1fr)\`;
  if (window.innerWidth <= 768) gridColumns = '1fr'; // Simple mobile fallback

  const shadowStyle = cardShadow === 'None' ? 'none' : cardShadow === 'Soft' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : cardShadow === 'Medium' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : cardShadow === 'Hard' ? '0 20px 25px -5px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
  const borderStyle = cardShadow === 'None' ? '1px solid #e5e7eb' : 'none';

  let hoverClass = "";
  if (hoverAnimation === "Scale Up") hoverClass = "clb-hover-scale";
  if (hoverAnimation === "Fade In") hoverClass = "clb-hover-fade";
  if (hoverAnimation === "3D Flip") hoverClass = "clb-hover-flip";

  const styles = \`
    <style>
      .clb-hover-scale { transition: transform 0.3s ease; }
      .clb-hover-scale:hover { transform: scale(1.05); z-index: 10; }
      .clb-hover-fade { transition: opacity 0.3s ease; }
      .clb-hover-fade:hover { opacity: 0.75; }
      .clb-hover-flip { transition: transform 0.5s ease; transform-style: preserve-3d; }
      .clb-hover-flip:hover { transform: rotateY(15deg) scale(1.02); z-index: 10; }
      .clb-product-card {
        border-radius: \${cardRadius}px;
        box-shadow: \${shadowStyle};
        border: \${borderStyle};
        overflow: hidden;
        background: white;
        text-decoration: none;
        color: inherit;
        display: block;
      }
      .clb-template-15-card:hover .clb-t15-overlay { opacity: 1 !important; }
    </style>
  \`;

  let html = \`<div style="width: 100%; transition: all 0.3s ease;">\${styles}\`;

  // Fallback to Template 1 if not fully implemented in JS yet
  if (templateId === "15") {
    html += \`<div style="display: grid; grid-template-columns: \${gridColumns}; gap: 20px; padding: 10px;">\`;
    products.forEach(p => {
      html += \`
        <a href="\${p.url}" class="\${hoverClass} clb-template-15-card" style="position: relative; height: 450px; background-color: white; overflow: hidden; border-radius: \${cardRadius}px; box-shadow: \${shadowStyle}; border: \${borderStyle}; display: block;">
          <img src="\${p.image}" alt="\${p.title}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
          <div class="clb-t15-overlay" style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease; background-color: rgba(255,255,255,0.95); padding: 32px; text-align: center;">
            <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 400; letter-spacing: 1px;">\${p.title}</h3>
            <p style="margin: 0 0 24px 0; color: #666;">\${p.price}</p>
            <button style="background: black; color: white; border: none; padding: 14px 40px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer;">View Details</button>
          </div>
        </a>
      \`;
    });
    html += \`</div>\`;
  } else {
    // Generic grid for all other templates (can be expanded later)
    html += \`<div style="display: grid; grid-template-columns: \${gridColumns}; gap: 24px;">\`;
    products.forEach(p => {
      html += \`
        <a href="\${p.url}" class="\${hoverClass} clb-product-card">
          <div style="height: 250px; width: 100%;"><img src="\${p.image}" alt="\${p.title}" style="width: 100%; height: 100%; object-fit: cover;"></div>
          <div style="padding: 20px; text-align: center;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">\${p.title}</h3>
            <p style="margin: 0 0 16px 0; color: #666; font-weight: 500;">\${p.price}</p>
            <button style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid black; background-color: transparent; color: black; font-weight: 600; cursor: pointer;">Quick View</button>
          </div>
        </a>
      \`;
    });
    html += \`</div>\`;
  }

  html += \`</div>\`;
  root.innerHTML = html;
}
