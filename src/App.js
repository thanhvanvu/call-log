import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { Popover, Modal, Button } from 'antd'

const content = (
  <div>
    <p>Chọn đáp án đi ba :v</p>
  </div>
)

const questions = [
  {
    question: 'Bạn thích trai hay gái ?',
    answers: [
      {
        key: 'Trai',
        selected: false,
      },
      {
        key: 'Gái',
        selected: false,
      },
    ],
    correctAnswer: ['Trai'],
  },
  {
    question: 'Bạn bao nhiêu tuổi ??',
    answers: [
      {
        key: '30',
        selected: false,
      },
      {
        key: '31',
        selected: false,
      },
      {
        key: '35',
        selected: false,
      },
    ],
    correctAnswer: ['30', '31', '35'],
  },
  {
    question: 'Bạn là top hay bottom',
    answers: [
      {
        key: 'Top',
        selected: false,
      },
      {
        key: 'Bottom',
        selected: false,
      },
      {
        key: 'Đéo',
        selected: false,
      },
    ],
    correctAnswer: ['Top', 'Bottom'],
  },
]

function App() {
  const [currentQuestion, setCurrentQuestion] = useState({})
  const [questionArray, setQuestionArray] = useState([])
  const [result, setResult] = useState('')
  const [moveButton, setMoveButton] = useState('slide-center')
  const [correctModal, setCorrectModal] = useState(false)

  const handleClickAnswer = (answer) => {
    setResult(answer)
    // shallow copy
    let copiedQuestion = { ...currentQuestion }

    copiedQuestion.answers.forEach((element) => {
      if (answer === element.key) {
        element.selected = 'true'
      } else {
        element.selected = 'false'
      }
    })

    setCurrentQuestion(copiedQuestion)
  }

  const handleSubmit = () => {
    console.log(currentQuestion.correctAnswer)
    let correctAnswer = currentQuestion.correctAnswer

    correctAnswer.forEach((answer) => {
      if (result !== answer) {
        switch (moveButton) {
          case 'slide-center':
            const position1 = ['slide-left', 'slide-right']
            const randomPosition =
              position1[Math.floor(Math.random() * position1.length)]

            setMoveButton(randomPosition)
            break
          case 'slide-left':
            setMoveButton('slide-right')
            break
          case 'slide-right':
            setMoveButton('slide-left')
            break
          default:
            break
        }
      } else {
        handleOK()
      }
    })
  }

  const handleOK = () => {
    setMoveButton('slide-center')
    let copiedQuestion = questionArray
    let questionLength = copiedQuestion.length
    let selectedQuestionIndex = Math.floor(Math.random() * questionLength)

    if (copiedQuestion.length > 0) {
      let selectedQuestion = copiedQuestion[selectedQuestionIndex]
      setCurrentQuestion(selectedQuestion)
    } else {
      setCurrentQuestion({})
    }

    copiedQuestion.splice(selectedQuestionIndex, 1)

    setQuestionArray(copiedQuestion)
    setResult('')
    setCorrectModal(false)
  }

  useEffect(() => {
    let copiedQuestion = [...questions]
    let questionLength = copiedQuestion.length
    let selectedQuestionIndex = Math.floor(Math.random() * questionLength)
    let selectedQuestion = copiedQuestion[selectedQuestionIndex]

    setCurrentQuestion(selectedQuestion)

    copiedQuestion.splice(selectedQuestionIndex, 1)

    setQuestionArray(copiedQuestion)
  }, [])

  return (
    <div className="App">
      <div className="modal-question">
        {Object.keys(currentQuestion).length === 0 ? (
          <>
            <p className="question-finish">
              Theo như kết quả bạn chọn, dự đoán là bạn bị: GAY :))
            </p>
          </>
        ) : (
          <>
            {currentQuestion && (
              <div className="modal-top">
                <div className="question-section">
                  <p className="question">
                    {currentQuestion
                      ? currentQuestion.question
                      : 'Chúc Mừng Hơ nì đã hoàn thành hết các câu hỏi :))'}
                  </p>
                </div>

                <div className="answer-section">
                  {currentQuestion &&
                    currentQuestion.answers &&
                    currentQuestion.answers.length > 0 &&
                    currentQuestion.answers.map((answer, index) => {
                      return (
                        <span
                          className={
                            answer.selected === 'true'
                              ? 'answer selected'
                              : 'answer'
                          }
                          key={index}
                          onClick={() => handleClickAnswer(answer.key)}
                        >
                          {answer ? answer.key : ''}
                        </span>
                      )
                    })}
                </div>
              </div>
            )}

            <div className="modal-bottom">
              {result === '' ? (
                <Popover content={content} trigger="click">
                  <span className={`submit ${moveButton}`}>Xác nhận</span>
                </Popover>
              ) : (
                <span
                  className={`submit ${moveButton}`}
                  onClick={() => handleSubmit()}
                >
                  Xác nhận
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
