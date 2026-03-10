import React from 'react';

// NOTE:
// Keep this component in a simple structure with exactly one <h2> and one <p>.
// The sync tool (tools/apply_prospective_content.py) copies these two text values
// into the production bundle used by the live website.
function Prospective() {
  return (
    <div className="container">
      <h2>入部希望の方へ</h2>
      <p>こちらに新入部員へのメッセージや募集要項などを記載します。</p>
    </div>
  );
}

export default Prospective;
