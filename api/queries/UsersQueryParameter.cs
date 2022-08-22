using System;
using System.Linq.Expressions;
using System.Linq;
using System.Collections.Generic;
using LinqKit;
using NotifySlackOfWebMeetingAdmin.Apis.Entities;

namespace NotifySlackOfWebMeetingAdmin.Apis.Queries
{
    /// <summary>
    /// ユーザー情報を取得する抽出条件パラメータを表す
    /// </summary>
    public class UsersQueryParameter
    {
        #region プロパティ

        /// <summary>
        /// 一意とするID一覧(カンマ区切り)
        /// </summary>
        public string Ids { get; set; }

        /// <summary>
        /// 一意とするID一覧
        /// </summary>
        public IEnumerable<string> IdValues => Ids.Split(",").Select(id => id.Trim());

        /// <summary>
        /// ユーザー名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Eメールアドレス
        /// </summary>
        public string EmailAddress { get; set; }

        /// <summary>
        /// ユーザープリンシパル名
        /// </summary>
        public string UserPrincipal { get; set; }

        /// <summary>
        /// ID一覧が指定されているか
        /// </summary>
        public bool HasIds
        {
            get => !string.IsNullOrEmpty(Ids) && Ids.Split(",").Any();
        }

        /// <summary>
        /// ユーザー名が指定されているか
        /// </summary>
        public bool HasName {
            get {
                return !string.IsNullOrEmpty(Name);
            }
        }

        /// <summary>
        /// Eメールアドレスが指定されているか
        /// </summary>
        public bool HasEmailAddress {
            get {
                return !string.IsNullOrEmpty(EmailAddress);
            }
        }

        /// <summary>
        /// ユーザープリンシパル名が指定されているか
        /// </summary>
        public bool HasUserPrincipal {
            get {
                return !string.IsNullOrEmpty(UserPrincipal);
            }
        }

        #endregion

        #region 公開サービス

        /// <summary>
        /// 抽出条件の式ツリーを取得する
        /// </summary>
        /// <returns>AND条件で結合した抽出条件の式ツリー</returns>
        public Expression<Func<User, bool>> GetWhereExpression()
        {
            // パラメータに指定された項目をAND条件で結合する。
            Expression<Func<User, bool>> expr = PredicateBuilder.New<User>(true);
            var original = expr;
            if (this.HasIds)
            {
                expr = expr.And(s => this.IdValues.Contains(s.Id));
            }
            if (this.HasName)
            {
                expr = expr.And(s => s.Name.Contains(this.Name));
            }
            if (this.HasEmailAddress)
            {
                expr = expr.And(s => s.EmailAddress.Contains(this.EmailAddress));
            }
            if (this.HasUserPrincipal)
            {
                expr = expr.And(s => s.UserPrincipal == this.UserPrincipal);
            }
            if (expr == original)
            {
                expr = x => true;
            }

            return expr;
        }

        #endregion
    }
}