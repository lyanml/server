const express = require('express');
const router = express.Router();
const db = require('./database');

// 获取所有问卷
router.get('/surveys', (req, res) => {
  db.getAllSurveys((error, surveys) => {
    if (error) {
      console.error('获取所有问卷时发生错误:', error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      });
    }
    res.json({
      code: 200,
      message: '获取成功',
      data: surveys,
    });
  });
});

// 根据ID获取问卷
router.get('/surveys/:id', (req, res) => {
  const id = req.params.id;
  db.getSurveyById(id, (error, survey) => {
    if (error) {
      console.error(`获取ID为 ${id} 的问卷时发生错误:`, error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      });
    }
    if (!survey) {
      return res.status(404).json({
        code: 404,
        message: '问卷未找到',
        data: null,
      });
    }
    res.json({
      code: 200,
      message: '获取成功',
      data: survey,
    });
  });
});

// 创建新的问卷
router.post('/surveys', (req, res) => {
  const newSurvey = req.body;
  // 在这里添加输入验证逻辑
  db.createSurvey(newSurvey, (error, insertId) => {
    if (error) {
      console.error('创建问卷时发生错误:', error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      });
    }
    res.status(200).json({
      code: 200,
      message: '问卷创建成功',
      data: { id: insertId },
    });
  });
});

// 更新问卷
router.put('/surveys/:id', (req, res) => {
  const id = req.params.id;
  const updatedSurvey = req.body;
  // 在这里添加输入验证逻辑
  db.updateSurvey(id, updatedSurvey, (error, success) => {
    if (error) {
      console.error(`更新ID为 ${id} 的问卷时发生错误:`, error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      });
    }
    if (!success) {
      return res.status(404).json({
        code: 404,
        message: '问卷未找到',
        data: null,
      });
    }
    res.json({
      code: 200,
      message: '问卷更新成功',
      data: null,
    });
  });
});

// 删除问卷
router.delete('/surveys/:id', (req, res) => {
  const id = req.params.id;
  db.deleteSurvey(id, (error, success) => {
    if (error) {
      console.error(`删除ID为 ${id} 的问卷时发生错误:`, error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      });
    }
    if (!success) {
      return res.status(404).json({
        code: 404,
        message: '问卷未找到',
        data: null,
      });
    }
    res.json({
      code: 200,
      message: '问卷删除成功',
      data: null,
    });
  });
});



// 创建新的在线问卷并返回所有数据
router.post('/online', (req, res) => {
  const newOnlineSurvey = req.body;
  // 在这里添加输入验证逻辑
  db.createOnlineSurvey(newOnlineSurvey, (error, allResults) => {
      if (error) {
          console.error('创建在线问卷时发生错误:', error);
          return res.status(500).json({
              code: 500,
              message: '服务器内部错误',
              data: null,
          });
      }
      res.status(200).json({
          code: 200,
          message: '在线问卷创建成功',
          data: allResults,
      });
  });
});

// 根据 surveyNo 更新在线问卷
router.put('/online/:surveyNo', (req, res) => {
  const surveyNo = req.params.surveyNo;
  const updateOnlineSurvey = req.body;
  // 在这里添加输入验证逻辑
  db.updateOnlineSurvey(surveyNo, updateOnlineSurvey, (error, success) => {
      if (error) {
          console.error(`更新 surveyNo 为 ${surveyNo} 的在线问卷时发生错误:`, error);
          return res.status(500).json({
              code: 500,
              message: '服务器内部错误',
              data: null,
          });
      }
      if (!success) {
          return res.status(404).json({
              code: 404,
              message: '在线问卷未找到',
              data: null,
          });
      }
      res.json({
          code: 200,
          message: '在线问卷更新成功',
          data: null,
      });
  });
});
// 根据 surveyNo 获取 Survey 和 OnlineSurvey 数据
router.get('/online/:surveyNo', (req, res) => {
  const surveyNo = req.params.surveyNo;
  db.getSurveyAndOnlineSurveyBySurveyNo(surveyNo, (error, results) => {
      if (error) {
          console.error(`查询 surveyNo 为 ${surveyNo} 的 Survey 和 OnlineSurvey 数据时发生错误:`, error);
          return res.status(500).json({
              code: 500,
              message: '服务器内部错误',
              data: null,
          });
      }
      res.status(200).json({
          code: 200,
          message: '查询成功',
          data: results,
      });
  });
});
module.exports = router;
