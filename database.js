const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
 
    connectionLimit: 10, // 连接池中的最大连接数
    charset: 'utf8'
});
// 查询所有问卷
function getAllSurveys(callback) {
    pool.query('SELECT * FROM Survey', (error, results) => {
        if (error) {
            console.error('查询所有问卷时发生错误:', error);
            return callback(error);
        }
         // 将日期格式化为本地化风格
         results.forEach(survey => {
            survey.createDate = new Date(survey.createDate).toLocaleString();
            survey.updateDate = new Date(survey.updateDate).toLocaleString();
        });
        callback(null, results);
    });
}

// 根据ID查询问卷
function getSurveyById(id, callback) {
    pool.query('SELECT * FROM Survey WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(`查询ID为 ${id} 的问卷时发生错误:`, error);
            return callback(error);
        }
        // 将日期格式化为本地化风格
        results.forEach(survey => {
            survey.createDate = new Date(survey.createDate).toLocaleString();
            survey.updateDate = new Date(survey.updateDate).toLocaleString();
        });
        callback(null, results[0]);
    });
}

// 保存问卷
function createSurvey(survey, callback) {
    pool.query('INSERT INTO Survey SET ?', survey, (error, results) => {
        if (error) {
            console.error('创建问卷时发生错误:', error);
            return callback(error);
        }
        callback(null, results.insertId);
    });
}

// 更新问卷
function updateSurvey(id, survey, callback) {
    pool.query('UPDATE Survey SET ? WHERE id = ?', [survey, id], (error, results) => {
        if (error) {
            console.error(`更新ID为 ${id} 的问卷时发生错误:`, error);
            return callback(error);
        }
        callback(null, results.affectedRows > 0);
    });
}

// 删除问卷
function deleteSurvey(id, callback) {
    pool.query('DELETE FROM Survey WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(`删除ID为 ${id} 的问卷时发生错误:`, error);
            return callback(error);
        }
        callback(null, results.affectedRows > 0);
    });
}
// 创建新的在线问卷并返回创建的这条数据的所有数据
function createOnlineSurvey(onlineSurvey, callback) {
    pool.query('INSERT INTO OnlineSurvey SET ?', onlineSurvey, (error, results) => {
        if (error) {
            console.error('创建在线问卷时发生错误:', error);
            return callback(error);
        }
        // 获取刚刚创建的问卷的ID
        const createdId = results.insertId;
        // 查询刚刚创建的问卷的所有数据
        pool.query('SELECT * FROM OnlineSurvey WHERE id = ?', [createdId], (error, allResults) => {
            if (error) {
                console.error('查询刚刚创建的在线问卷时发生错误:', error);
                return callback(error);
            }
            callback(null, allResults[0]); // 返回创建的这条数据的所有数据
        });
    });
}

// 根据 surveyNo 更新在线问卷
function updateOnlineSurvey(surveyNo, onlineSurvey, callback) {
    const query = 'UPDATE OnlineSurvey SET ? WHERE surveyNo = ?';
    pool.query(query, [onlineSurvey, surveyNo], (error, results) => {
        if (error) {
            console.error(`更新 surveyNo 为 ${surveyNo} 的在线问卷时发生错误:`, error);
            return callback(error);
        }
        callback(null, results.affectedRows > 0);
    });
}

// 根据 surveyNo 获取 Survey 和 OnlineSurvey 数据
function getSurveyAndOnlineSurveyBySurveyNo(surveyNo, callback) {
    const query = `
        SELECT s.*, o.* 
        FROM Survey s 
        JOIN OnlineSurvey o ON s.id = o.surveyTypeId 
        WHERE o.surveyNo = ?
    `;
    pool.query(query, [surveyNo], (error, results) => {
        if (error) {
            console.error(`查询 surveyNo 为 ${surveyNo} 的 Survey 和 OnlineSurvey 数据时发生错误:`, error);
            return callback(error);
        }
        callback(null, results);
    });
}

module.exports = {
    getAllSurveys,
    getSurveyById,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    createOnlineSurvey,
    updateOnlineSurvey,
    getSurveyAndOnlineSurveyBySurveyNo 
};