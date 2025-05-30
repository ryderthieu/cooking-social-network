"use client"

import { useState } from "react"
import { Plus, Minus, X, Upload, Play, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import BreadCrumb from "@/components/common/BreadCrumb"

export default function CreateRecipeForm() {
  const [recipeName, setRecipeName] = useState("")
  const [description, setDescription] = useState("")
  const [servings, setServings] = useState("4")
  const [cookingTime, setCookingTime] = useState("")
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }])
  const [steps, setSteps] = useState([{ summary: "", detail: "", time: "" }])
  const [mainIngredients, setMainIngredients] = useState([])
  const [nutrition, setNutrition] = useState({
    calories: "",
    fat: "",
    protein: "",
    carb: "",
    cholesterol: "",
  })
  const [videoUrl, setVideoUrl] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const mainIngredientOptions = [
    { label: "Thịt gà", value: "chicken", icon: "🐔" },
    { label: "Cá", value: "fish", icon: "🐟" },
    { label: "Thịt bò", value: "beef", icon: "🐄" },
    { label: "Thịt heo", value: "pork", icon: "🐷" },
    { label: "Rau", value: "vegetable", icon: "🥬" },
    { label: "Trứng", value: "egg", icon: "🥚" },
  ]

  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[idx][field] = value
    setIngredients(newIngredients)
  }

  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }])
  const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx))

  const handleStepChange = (idx, field, value) => {
    const newSteps = [...steps]
    newSteps[idx][field] = value
    setSteps(newSteps)
  }

  const addStep = () => setSteps([...steps, { summary: "", detail: "", time: "" }])
  const removeStep = (idx) => setSteps(steps.filter((_, i) => i !== idx))

  const toggleMainIngredient = (value) => {
    setMainIngredients((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleNutritionChange = (field, value) => {
    setNutrition({ ...nutrition, [field]: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      recipeName,
      description,
      servings,
      cookingTime,
      ingredients,
      steps,
      mainIngredients,
      nutrition,
      videoUrl,
    })
    alert("Công thức đã được lưu thành công!")
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-br to-yellow-200 via-amber-300 from-orange-400 pt-10 pb-20 px-6 text-center">
        <BreadCrumb />
        <h1 className="text-[2.5em] font-bold text-white">Tạo công thức</h1>
      </div>

      {/* Main Form */}
      <div className=" mx-auto px-4  relative z-20">
        <div className="">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Section */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Image Upload */}
                <div className="lg:col-span-1">
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Hình ảnh món ăn</label>
                  <div className="relative group">
                    <div className="bg-gradient-to-br from-orange-100/50 to-yellow-200/50 rounded-2xl aspect-square flex items-center justify-center cursor-pointer border-2 border-dashed border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-2xl"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          <Upload className="w-12 h-12 text-orange-400 mb-3" />
                          <span className="text-orange-600 font-medium">Tải ảnh lên</span>
                          <span className="text-orange-400 text-sm mt-1">PNG, JPG, GIF</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recipe Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label htmlFor="recipeName" className="block text-lg font-semibold text-gray-700 mb-2">
                      Tên món ăn
                    </label>
                    <input
                      id="recipeName"
                      type="text"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="Ví dụ: Gà rán giòn rụm"
                      className="w-full px-4 py-3 border outline-none border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-lg"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-2">
                      Mô tả món ăn
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả ngắn gọn về món ăn của bạn..."
                      rows={4}
                      className="w-full px-4 py-3 border outline-none border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Số người ăn
                      </label>
                      <input
                        type="text"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="w-full px-4 py-3 border outline-none border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="4"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Thời gian nấu
                      </label>
                      <input
                        type="text"
                        value={cookingTime}
                        onChange={(e) => setCookingTime(e.target.value)}
                        className="w-full px-4 py-3 border outline-none border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="30 phút"
                      />
                    </div>
                  </div>

                  {/* Main Ingredients */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Nguyên liệu chính</label>
                    <p className="text-lg text-gray-500 mb-3">Chọn các nguyên liệu chính trong món ăn của bạn</p>
                    <div className="flex flex-wrap gap-3">
                      {mainIngredientOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`px-4 py-2 rounded-full text-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                            mainIngredients.includes(option.value)
                              ? "bg-amber-400 text-white shadow-lg scale-105"
                              : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200 hover:bg-orange-50"
                          }`}
                          onClick={() => toggleMainIngredient(option.value)}
                        >
                          <span className="text-lg">{option.icon}</span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ingredients Section */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        1
                      </span>
                      Nguyên liệu
                    </h3>

                    <div className="space-y-4">
                      {ingredients.map((ingredient, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-orange-100"
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Tên nguyên liệu"
                              value={ingredient.name}
                              onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div className="w-32">
                            <input
                              type="text"
                              placeholder="Số lượng"
                              value={ingredient.amount}
                              onChange={(e) => handleIngredientChange(idx, "amount", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          {ingredients.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeIngredient(idx)}
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addIngredient}
                        className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-100"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm nguyên liệu
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Steps Section */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        2
                      </span>
                      Các bước thực hiện
                    </h3>

                    <div className="space-y-4">
                      {steps.map((step, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-amber-400">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                              {idx + 1}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Tiêu đề bước"
                                  value={step.summary}
                                  onChange={(e) => handleStepChange(idx, "summary", e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Thời gian"
                                  value={step.time}
                                  onChange={(e) => handleStepChange(idx, "time", e.target.value)}
                                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-sm"
                                />
                              </div>
                              <textarea
                                placeholder="Mô tả chi tiết cách thực hiện..."
                                value={step.detail}
                                onChange={(e) => handleStepChange(idx, "detail", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm"
                                rows={2}
                              />
                            </div>
                            {steps.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeStep(idx)}
                                className="text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addStep}
                        className="w-full border-dashed border-amber-300 text-amber-600 hover:bg-amber-100"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm bước
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sections */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Nutrition Section */}
                <div className="">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        3
                      </span>
                      Thông tin dinh dưỡng
                    </h3>

                    <div className="space-y-4">
                      {[
                        { key: "calories", label: "Calories", unit: "kcal" },
                        { key: "fat", label: "Chất béo", unit: "g" },
                        { key: "protein", label: "Protein", unit: "g" },
                        { key: "carb", label: "Carbohydrate", unit: "g" },
                        { key: "cholesterol", label: "Cholesterol", unit: "mg" },
                      ].map((item) => (
                        <div key={item.key} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100">
                          <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={nutrition[item.key]}
                              onChange={(e) => handleNutritionChange(item.key, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              placeholder="0"
                            />
                            <span className="ml-2 text-gray-500 font-medium">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Section */}
                <div className="">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        4
                      </span>
                      Video hướng dẫn
                    </h3>

                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-red-100">
                      <div className="bg-gradient-to-br from-red-100 to-orange-100 aspect-video flex items-center justify-center border-2 border-dashed border-red-200">
                        {videoUrl ? (
                          <div className="text-red-600">Video Preview</div>
                        ) : (
                          <div className="text-center">
                            <Play className="w-12 h-12 text-red-400 mx-auto mb-2" />
                            <p className="text-red-600 font-medium text-sm">Thêm video hướng dẫn</p>
                            <p className="text-red-400 text-xs">MP4, MOV, AVI</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <input
                          type="url"
                          placeholder="Hoặc dán link video YouTube/Vimeo..."
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="px-8 py-4 text-sm font-medium border-orange-300 text-black hover:bg-orange-50"
                >
                   Lưu nháp
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-4 text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                >
                  Chia sẻ công thức
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
