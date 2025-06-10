import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import ImageSlider from '../components/image-slider'

const mockImages = [
  { url: 'https://example.com/img1.jpg', label: 'Front' },
  { url: 'https://example.com/img2.jpg', label: 'Side' },
]

describe('ImageSlider', () => {
  it('renders single image without controls', () => {
    const { getByAltText, queryByText } = render(
      <ImageSlider images={[mockImages[0]]} />,
    )
    expect(getByAltText(/Front/i)).toBeTruthy()
    expect(queryByText(/◀/)).toBeNull()
  })

  it('navigates between multiple images', () => {
    const { getByAltText, getByText } = render(
      <ImageSlider images={mockImages} />,
    )
    expect(getByAltText(/Front/i)).toBeTruthy()
    fireEvent.click(getByText(/▶/))
    expect(getByAltText(/Side/i)).toBeTruthy()
  })
})
