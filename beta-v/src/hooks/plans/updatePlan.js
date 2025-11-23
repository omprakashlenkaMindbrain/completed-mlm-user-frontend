import { useCallback, useState } from "react"
import BASE_URL from "../../config/api"
import { useAuth } from "../../context/AuthContext"

const MAX_FILE_SIZE = 1048576 // 1MB

export const useUpdatePayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const { getaccesstoken } = useAuth() // This is a string token, not a function

  const updatePayment = useCallback(
    async (planId, paymentFile) => {
      setLoading(true)
      setError(null)
      setSuccess(false)

      // ----------- FRONTEND VALIDATION -----------
      if (!paymentFile) {
        setError("Payment screenshot is required.")
        setLoading(false)
        return null
      }

      if (paymentFile.size > MAX_FILE_SIZE) {
        setError("Payment screenshot file size cannot exceed 1 MB.")
        setLoading(false)
        return null
      }

      if (!paymentFile.type.startsWith("image/")) {
        setError("Please upload a valid image file.")
        setLoading(false)
        return null
      }

      try {
        // ---------- FORM DATA ----------
        const formData = new FormData()
        formData.append("payment_ss", paymentFile)

        // ---------- FETCH ----------
        const res = await fetch(`${BASE_URL}/api/update/${planId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getaccesstoken}`, // token directly
          },
          body: formData,
        })

        const data = await res.json()
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Failed to update payment screenshot.")
        }
        setSuccess(true)
        return data
      } catch (err) {
        setError(err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [getaccesstoken],
  )

  return { updatePayment, loading, error, success }
}
