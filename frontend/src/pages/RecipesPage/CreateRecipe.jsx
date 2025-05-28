import React, { useState } from 'react';

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [steps, setSteps] = useState([{ summary: '', detail: '' }]);
  const [mainIngredients, setMainIngredients] = useState([]);
  const [nutrition, setNutrition] = useState({
    calories: '',
    fat: '',
    protein: '',
    carb: '',
    cholesterol: ''
  });

  const mainIngredientOptions = [
    { label: 'Thịt gà', value: 'chicken' },
    { label: 'Cá', value: 'fish' },
    { label: 'Thịt bò', value: 'beef' },
    { label: 'Thịt heo', value: 'pork' },
    { label: 'Rau', value: 'vegetable' },
    { label: 'Trứng', value: 'egg' }
  ];

  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[idx][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }]);
  const removeIngredient = idx => setIngredients(ingredients.filter((_, i) => i !== idx));

  const handleStepChange = (idx, field, value) => {
    const newSteps = [...steps];
    newSteps[idx][field] = value;
    setSteps(newSteps);
  };

  const addStep = () => setSteps([...steps, { summary: '', detail: '' }]);
  const removeStep = idx => setSteps(steps.filter((_, i) => i !== idx));

  const handleMainIngredient = value => {
    setMainIngredients(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleNutritionChange = (field, value) => {
    setNutrition({ ...nutrition, [field]: value });
  };

  return (
    <>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32, background: '#fff', borderRadius: 16 }}>
        <h2>Đăng công thức nấu ăn</h2>
        <form>
          {/* Ảnh đại diện */}
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <div style={{
                width: 180, height: 220, background: 'linear-gradient(135deg, #f9d976 0%, #f39f86 100%)',
                borderRadius: 12, marginBottom: 16
              }} />
              {/* Có thể thêm input upload ảnh ở đây */}
            </div>
            <div style={{ flex: 1 }}>
              <div>
                <label>Tên món ăn</label>
                <input type="text" maxLength={50} style={{ width: '100%' }} placeholder="Nhập tên món ăn" />
              </div>
              <div style={{ marginTop: 16 }}>
                <label>Mô tả</label>
                <textarea maxLength={200} style={{ width: '100%', minHeight: 60 }} placeholder="Mô tả ngắn về món ăn" />
              </div>
              <div style={{ marginTop: 16 }}>
                <label>Các nguyên liệu chính</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {mainIngredientOptions.map(opt => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleMainIngredient(opt.value)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: 20,
                        border: mainIngredients.includes(opt.value) ? '2px solid #f39f86' : '1px solid #ccc',
                        background: mainIngredients.includes(opt.value) ? '#fff7e6' : '#f7f7f7',
                        color: '#333',
                        cursor: 'pointer'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Thành phần */}
          <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
            <div style={{ flex: 1 }}>
              <h4>Thành phần</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span>Phù hợp với</span>
                <input type="number" min={1} style={{ width: 60 }} placeholder="người" />
              </div>
              {ingredients.map((ing, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="Tên thành phần"
                    value={ing.name}
                    onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <input
                    type="text"
                    placeholder="Số lượng"
                    value={ing.amount}
                    onChange={e => handleIngredientChange(idx, 'amount', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(idx)} style={{ color: 'red' }}>-</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addIngredient} style={{ marginTop: 8 }}>+ Thêm thành phần</button>
            </div>

            {/* Bước */}
            <div style={{ flex: 2 }}>
              <h4>Bước</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span>Thời gian nấu</span>
                <input type="number" min={1} style={{ width: 60 }} placeholder="phút" />
              </div>
              {steps.map((step, idx) => (
                <div key={idx} style={{ marginBottom: 12, borderLeft: '3px solid #f39f86', paddingLeft: 12 }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>Bước {idx + 1}</div>
                  <input
                    type="text"
                    placeholder="Tóm tắt"
                    maxLength={50}
                    value={step.summary}
                    onChange={e => handleStepChange(idx, 'summary', e.target.value)}
                    style={{ width: '100%', marginBottom: 4 }}
                  />
                  <textarea
                    placeholder="Mô tả chi tiết"
                    maxLength={200}
                    value={step.detail}
                    onChange={e => handleStepChange(idx, 'detail', e.target.value)}
                    style={{ width: '100%', minHeight: 40 }}
                  />
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(idx)} style={{ color: 'red', marginTop: 4 }}>- Xóa bước</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addStep}>+ Thêm bước</button>
            </div>
          </div>

          {/* Dinh dưỡng & Video */}
          <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
            <div style={{ flex: 1 }}>
              <h4>Dinh dưỡng</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label>Calories</label>
                  <input type="number" min={0} value={nutrition.calories} onChange={e => handleNutritionChange('calories', e.target.value)} placeholder="kcal" />
                </div>
                <div>
                  <label>Chất béo</label>
                  <input type="number" min={0} value={nutrition.fat} onChange={e => handleNutritionChange('fat', e.target.value)} placeholder="g" />
                </div>
                <div>
                  <label>Protein</label>
                  <input type="number" min={0} value={nutrition.protein} onChange={e => handleNutritionChange('protein', e.target.value)} placeholder="g" />
                </div>
                <div>
                  <label>Carbohydrate</label>
                  <input type="number" min={0} value={nutrition.carb} onChange={e => handleNutritionChange('carb', e.target.value)} placeholder="g" />
                </div>
                <div>
                  <label>Cholesterol</label>
                  <input type="number" min={0} value={nutrition.cholesterol} onChange={e => handleNutritionChange('cholesterol', e.target.value)} placeholder="mg" />
                </div>
              </div>
            </div>
            <div style={{ flex: 2 }}>
              <h4>Video hướng dẫn chi tiết</h4>
              <textarea style={{ width: '100%', minHeight: 120 }} placeholder="Link video hoặc mô tả chi tiết video" />
            </div>
          </div>

          {/* Nút lưu/chia sẻ */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 32 }}>
            <button type="submit" style={{ background: '#4ed17c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 32px', fontWeight: 600 }}>Lưu</button>
            <button type="button" style={{ background: '#f39f86', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 32px', fontWeight: 600 }}>Chia sẻ</button>
          </div>
        </form>
      </div>
    </>
  );
}