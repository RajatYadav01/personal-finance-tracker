module Api::V1
  class CategoriesController < ApplicationController
    def index
      @categories = Category.all
      render json: @categories
    end

    def create
      @category = current_user.categories.new(category_params)
      if @category.save
        render json: @category, status: :created
      else
        render json: @category.errors, status: :unprocessable_content
      end
    end

    def update
      @category = Category.find(params[:id])
      if @category.update(category_params)
        render json: @category
      else
        render json: @category.errors, status: :unprocessable_content
      end
    end

    def destroy
      @category = Category.find(params[:id])
      if @category.destroy
        head :no_content
      else
        render json: { error: 'Failed to delete category' }, status: :unprocessable_content
      end
    end

    private

    def category_params
      params.require(:category).permit(:name, :color, :user_id)
    end
  end
end
